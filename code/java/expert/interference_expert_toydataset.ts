/**
 * Detecção de interferência semântica em merges com Jev (TypeSafe System One).
 *
 * Boas práticas aplicadas (vindas do jev-demo e da documentação):
 *  - state = OBJETO (1-state/01): diffs, fatos e evidências com nomes descritivos.
 *  - Fatos calculados em código, não pelo modelo (1-state/03): diffs, linhas perdidas no merge, etc.
 *  - "Just enough" (1-state/04): hunks com contexto curto, em vez dos 4 arquivos completos.
 *  - Perguntas estreitas e atômicas (2-questions/03): uma pergunta por condição da definição.
 *  - Estrutura avançada (primitives/advanced): `instructions` e `criteria` como objetos
 *    (question / inspect / compare / focus; what / not_for / examples).
 *  - Fan-out especulativo em UMA chamada (2-questions/05): tudo é perguntado; o código decide o que vale.
 *  - Composite scoring + limiares + confiança (3-answers): a decisão final é do código.
 *  - As respostas ficam em cache: pesos e limiares são ajustados offline, sem novas chamadas.
 *
 * Uso (a partir da raiz do jev-demo):
 *   npm run scenario code/mergedataset/interference-detection.ts
 *   npm run scenario code/mergedataset/interference-detection.ts -- --tune
 *   npm run scenario code/mergedataset/interference-detection.ts -- --only 004S --no-annotations
 *   npm run scenario code/mergedataset/interference-detection.ts -- --limit 5 --concurrency 4 --refresh
 *
 * Opções:
 *   --tune             busca pesos/limiares nas respostas em cache, com validação leave-one-out
 *   --no-annotations   remove as anotações source/sink (ablação, evita depender delas)
 *   --only <texto>     só cenários cujo nome contém <texto>
 *   --limit <n>        limita o nº de cenários por conjunto
 *   --concurrency <n>  chamadas em paralelo (padrão 3)
 *   --refresh          ignora o cache
 */
import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.TYPESAFE_API_KEY) {
  console.error("Add your TypeSafe API key to .env before running the demo.");
  process.exit(1);
}

// ───────────────────────────── CLI ─────────────────────────────
const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);
const opt = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const TUNE = flag("tune");
const USE_ANNOTATIONS = !flag("no-annotations");
const REFRESH = flag("refresh");
const ONLY = opt("only");
const LIMIT = opt("limit") ? Number(opt("limit")) : Infinity;
const CONCURRENCY = Number(opt("concurrency") ?? 3);

const ROOT = dirname(fileURLToPath(import.meta.url));
const DATASETS = [
  { dir: "interference_qwen_java_toy_dataset", interferes: true },
  { dir: "no-interference_qwen_java_toy_dataset", interferes: false },
];
const CACHE_DIR = join(ROOT, ".jev-cache");
const RESULTS_DIR = join(ROOT, "results");

// ─────────────────── Diff em código (fatos, não matemática do modelo) ───────────────────
type Op = { t: " " | "+" | "-"; text: string };
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function diffLines(a: string[], b: string[]): Op[] {
  const A = a.map(norm);
  const B = b.map(norm);
  const n = A.length;
  const m = B.length;
  const w = m + 1;
  const L = new Uint32Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      L[i * w + j] = A[i] === B[j] ? L[(i + 1) * w + j + 1] + 1 : Math.max(L[(i + 1) * w + j], L[i * w + j + 1]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) ops.push({ t: " ", text: b[j++] }), i++;
    else if (L[(i + 1) * w + j] >= L[i * w + j + 1]) ops.push({ t: "-", text: a[i++] });
    else ops.push({ t: "+", text: b[j++] });
  }
  while (i < n) ops.push({ t: "-", text: a[i++] });
  while (j < m) ops.push({ t: "+", text: b[j++] });
  // linhas em branco adicionadas/removidas são ruído cosmético
  return ops.filter((o) => o.t === " " || norm(o.text) !== "");
}

/** Hunks compactos (contexto curto, tamanho limitado). */
function hunks(ops: Op[], context = 2, maxLines = 140) {
  const changed = ops.map((o, i) => (o.t === " " ? -1 : i)).filter((i) => i >= 0);
  const keep = new Set<number>();
  for (const i of changed) for (let k = i - context; k <= i + context; k++) if (k >= 0 && k < ops.length) keep.add(k);
  const out: string[] = [];
  let prev = -2;
  let truncated = false;
  for (const i of [...keep].sort((x, y) => x - y)) {
    if (out.length >= maxLines) {
      truncated = true;
      break;
    }
    if (i !== prev + 1) out.push("@@");
    const o = ops[i];
    out.push(`${o.t} ${o.text.trimEnd().slice(0, 220)}`);
    prev = i;
  }
  return {
    changed_lines: changed.length,
    is_empty: changed.length === 0,
    truncated,
    hunks: out.join("\n"),
  };
}

const addedOf = (ops: Op[]) => ops.filter((o) => o.t === "+").map((o) => norm(o.text));
const removedOf = (ops: Op[]) => ops.filter((o) => o.t === "-").map((o) => norm(o.text));
const cap = <T>(xs: T[], n = 20) => xs.slice(0, n);

// ─────────────────── Leitura dos artefatos do cenário ───────────────────
async function maybe(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return undefined;
  }
}

function parseAffected(text?: string) {
  const header: Record<string, string> = {};
  const marked: { tag: string; code: string }[] = [];
  const mergeRegion: string[] = [];
  let inMerge = false;
  for (const line of (text ?? "").split("\n")) {
    const h = line.match(/^#\s*([\w ]+?)\s*:\s*(.*)$/);
    if (h && !inMerge && !line.startsWith("# same region")) header[h[1].trim()] = h[2].trim();
    if (line.startsWith("# same region in merge.java")) {
      inMerge = true;
      continue;
    }
    if (inMerge) {
      const m = line.match(/^merge:\d+:\s?(.*)$/);
      if (m) mergeRegion.push(m[1].slice(0, 220));
      continue;
    }
    const m = line.match(/^(source|sink)@\S.*?:\d+: ?(.*)$/);
    if (m) marked.push({ tag: m[1], code: m[2].trim().slice(0, 220) });
  }
  return { header, marked, mergeRegion };
}

function parseReferencedVars(text: string | undefined, javaSources: string) {
  const vars: { name: string; scope: string; roles: string[] }[] = [];
  for (const line of (text ?? "").split("\n")) {
    if (!line || line.startsWith("#") || /^(source|sink):/.test(line)) continue;
    const [name, scope, roles] = line.split("\t");
    if (!name || !roles?.startsWith("roles=")) continue;
    // O extrator às vezes captura palavras de comentários ("which", "indicates"...):
    // só mantemos nomes que realmente aparecem em algum dos 4 programas.
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\b${escaped}\\b`).test(javaSources)) continue;
    vars.push({ name, scope, roles: roles.slice(6).split(",") });
  }
  return vars;
}

type Scenario = { id: string; dataset: string; interferes: boolean; state: Record<string, unknown>; trivial?: "not_interfere" };

async function loadScenario(datasetDir: string, interferes: boolean, name: string): Promise<Scenario> {
  const dir = join(ROOT, datasetDir, name);
  const [base, left, right, merge] = await Promise.all(
    ["base", "left", "right", "merge"].map((f) => readFile(join(dir, `${f}.java`), "utf8")),
  );
  const [affectedRaw, varsRaw] = await Promise.all([
    maybe(join(dir, "affected-lines.txt")),
    maybe(join(dir, "referenced-vars.txt")),
  ]);

  const [B, L, R, M] = [base, left, right, merge].map((s) => s.split("\n"));
  const bl = diffLines(B, L);
  const br = diffLines(B, R);
  const bm = diffLines(B, M);
  const lm = diffLines(L, M);
  const rm = diffLines(R, M);

  const mergeSet = new Set(M.map(norm));
  const baseSet = new Set(B.map(norm));
  const leftSet = new Set(L.map(norm));
  const rightSet = new Set(R.map(norm));

  const lAdded = addedOf(bl);
  const rAdded = addedOf(br);
  const lRemoved = removedOf(bl);
  const rRemoved = removedOf(br);

  const eq = (x: string[], y: string[]) => x.map(norm).filter(Boolean).join("\n") === y.map(norm).filter(Boolean).join("\n");
  const mergeEquals = { base: eq(M, B), left: eq(M, L), right: eq(M, R) };
  const leftEqualsRight = eq(L, R);

  const facts = {
    merge_equals: mergeEquals,
    left_equals_right: leftEqualsRight,
    left_added_but_missing_in_merge: cap(lAdded.filter((l) => !mergeSet.has(l))),
    right_added_but_missing_in_merge: cap(rAdded.filter((l) => !mergeSet.has(l))),
    left_removed_but_present_in_merge: cap(lRemoved.filter((l) => mergeSet.has(l) && !baseSet.has(l) === false)),
    right_removed_but_present_in_merge: cap(rRemoved.filter((l) => mergeSet.has(l) && !baseSet.has(l) === false)),
    merge_only_lines: cap(
      M.map(norm).filter((l) => l && !baseSet.has(l) && !leftSet.has(l) && !rightSet.has(l)),
    ),
  };

  const affected = parseAffected(affectedRaw);
  const vars = parseReferencedVars(varsRaw, [base, left, right, merge].join("\n"));

  const evidence = USE_ANNOTATIONS
    ? {
        note:
          "Hints from a dependency analysis between the two changes. 'source' and 'sink' are the two ends of a link " +
          "between statements affected by L and R. They can be noisy: confirm them in `diffs`.",
        marked_statements: cap(affected.marked, 25),
        merge_region: affected.mergeRegion.slice(0, 40).join("\n"),
        variables_in_dependency: vars.map((v) => ({ name: v.name, roles: v.roles })).slice(0, 25),
        variables_both_roles: vars.filter((v) => v.roles.includes("source") && v.roles.includes("sink")).map((v) => v.name),
      }
    : undefined;

  const state = {
    context: {
      project: affected.header["project"],
      class_name: affected.header["class name"],
      member: affected.header["method name"],
      programs:
        "B = base, L = left change, R = right change, Merge = automatic merge of L and R. " +
        "Diffs are line-based and ignore whitespace differences. '+' added, '-' removed, '@@' separates hunks.",
    },
    diffs: {
      base_to_left: hunks(bl),
      base_to_right: hunks(br),
      base_to_merge: hunks(bm),
      left_to_merge: hunks(lm),
      right_to_merge: hunks(rm),
    },
    facts,
    evidence,
  };

  // Atalho determinístico: se um lado não mudou nada e o merge == outro lado, não há o que interferir.
  const trivial =
    (bl.every((o) => o.t === " ") && mergeEquals.right) || (br.every((o) => o.t === " ") && mergeEquals.left)
      ? ("not_interfere" as const)
      : undefined;

  return { id: `${datasetDir.split("_")[0]}/${name}`, dataset: datasetDir, interferes, state, trivial };
}

async function loadAll(): Promise<Scenario[]> {
  const all: Scenario[] = [];
  for (const { dir, interferes } of DATASETS) {
    let entries;
    try {
      entries = await readdir(join(ROOT, dir), { withFileTypes: true });
    } catch {
      console.warn(`(ignorado) pasta não encontrada: ${dir}`);
      continue;
    }
    const names = entries
      .filter((e) => e.isDirectory() && /^\d+S_?/.test(e.name))
      .map((e) => e.name)
      .filter((n) => !ONLY || n.includes(ONLY))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .slice(0, LIMIT);
    for (const n of names) all.push(await loadScenario(dir, interferes, n));
  }
  return all;
}

// ───────────────────────── Perguntas (estrutura avançada) ─────────────────────────
const yes = (what: string, examples: string[]) => ({ what, examples });

const questions = {
  // Gates de comportamento: só mudanças comportamentais podem interferir.
  leftChangesBehavior: noul(
    {
      question: "Does L change the runtime behaviour of the program relative to B?",
      inspect: "`diffs.base_to_left`",
      focus: "Ignore formatting, comments, renames without semantic effect. Log-level changes count as behaviour only if they change which messages are emitted.",
    },
    {
      true: yes("Changes values, control flow, conditions, collections, constants, signatures or calls", ["a constant changes from 22 to 23", "a new entry is added to a list", "a condition is added"]),
      false: yes("Only formatting, comments or equivalent rewrites", ["reindentation", "a comment edit"]),
    },
  ),
  rightChangesBehavior: noul(
    {
      question: "Does R change the runtime behaviour of the program relative to B?",
      inspect: "`diffs.base_to_right`",
      focus: "Ignore formatting, comments, renames without semantic effect.",
    },
    {
      true: yes("Changes values, control flow, conditions, collections, constants, signatures or calls", ["a new parameter is passed", "a branch is removed"]),
      false: yes("Only formatting, comments or equivalent rewrites", ["reindentation"]),
    },
  ),

  // Sobreposição dos elementos de estado tocados
  bothTouchSameElement: noul(
    {
      question: "Do L and R modify the same state element (variable, field, collection, constant, condition or return value)?",
      compare: ["`diffs.base_to_left`", "`diffs.base_to_right`"],
      focus: "Same element, even if in different lines. Different elements in the same method do not count.",
    },
    {
      true: yes("Both changes write to, or alter the logic that computes, the same element", ["both edit the same list of registered types", "both change the same constant"]),
      false: yes("Each change touches a different element", ["L adds a log line, R changes a timeout"]),
    },
  ),

  // Condição 1: B, L e R computam valores diferentes para x
  cond1AllDiffer: noul(
    {
      question: "Is there a state element x for which B, L and R all compute different values?",
      compare: ["`diffs.base_to_left`", "`diffs.base_to_right`", "`facts.left_equals_right`"],
      focus: "The three values must be pairwise different. If L and R compute the same value, the answer is no.",
    },
    {
      true: yes("x has three distinct values across B, L and R", ["B: 22, L: 23, R: 21", "B: no entry, L: entry A, R: entry B in the same slot"]),
      false: yes("At least two of the three programs agree on every element", ["L and R make the identical change", "only one side changes x"]),
    },
  ),

  // Condição 2: L (ou R) difere de B e do Merge → mudança de um lado não preservada
  cond2LeftNotPreserved: noul(
    {
      question: "Is there a state element x for which L computes a different value than both B and Merge?",
      inspect: ["`diffs.left_to_merge`", "`facts.left_added_but_missing_in_merge`", "`facts.left_removed_but_present_in_merge`"],
      focus: "Merge must NOT carry L's new behaviour for x, while B also differs from L on x.",
    },
    {
      true: yes("L's change to x is dropped or overwritten in Merge", ["L adds a line that does not appear in Merge", "Merge keeps R's value for x"]),
      false: yes("Merge preserves every behavioural change introduced by L", ["Merge contains all lines added by L"]),
    },
  ),
  cond2RightNotPreserved: noul(
    {
      question: "Is there a state element x for which R computes a different value than both B and Merge?",
      inspect: ["`diffs.right_to_merge`", "`facts.right_added_but_missing_in_merge`", "`facts.right_removed_but_present_in_merge`"],
      focus: "Merge must NOT carry R's new behaviour for x, while B also differs from R on x.",
    },
    {
      true: yes("R's change to x is dropped or overwritten in Merge", ["R's new condition is absent from Merge", "Merge uses L's constant instead of R's"]),
      false: yes("Merge preserves every behavioural change introduced by R", ["Merge contains all lines added by R"]),
    },
  ),

  // Condição 3: B, L, R iguais mas o Merge difere
  cond3MergeIntroduces: noul(
    {
      question: "Is there a state element x for which B, L and R compute the same value but Merge computes a different one?",
      inspect: ["`facts.merge_only_lines`", "`diffs.base_to_merge`"],
      focus: "Merge must contain behaviour that exists in none of B, L, R for x. A textual combination of two edits to the same element is not enough unless x differs from all of B, L and R.",
    },
    {
      true: yes("Merge contains new lines or an unexpected combination absent from B, L and R", ["a statement placed in a different branch by the merge tool"]),
      false: yes("Every line of Merge comes from B, L or R", ["Merge is exactly L or exactly R"]),
    },
  ),

  // Dependência entre as mudanças (usa a evidência opcional)
  behaviourDependsOnOtherChange: noul(
    {
      question: "Does the behaviour introduced by one change depend on a variable, call or value that the other change also modifies?",
      compare: ["`diffs.base_to_left`", "`diffs.base_to_right`", "`evidence.variables_both_roles`"],
      focus: "Look for data or control dependency across the two changes, not just proximity in the file.",
    },
    {
      true: yes("One change reads or relies on what the other writes or alters", ["L tests a flag that R redefines", "L's count must match R's list size"]),
      false: yes("The changes are independent in data and control flow", ["L edits error handling, R edits an unrelated option"]),
    },
  ),

  // Veredito como Choice com fronteiras explícitas (inclui "none")
  kind: choice(
    {
      question: "Which interference condition is most clearly demonstrated by the scenario?",
      inspect: ["`diffs`", "`facts`"],
      focus: "Pick the condition that holds on the strongest evidence. Use `none` only if no condition holds.",
    },
    {
      all_differ: {
        what: "B, L and R compute different values for the same state element",
        not_for: "L and R making the same change, or only one side changing",
        examples: ["B: 22, L: 23, R: 21"],
      },
      side_not_preserved: {
        what: "L (or R) computes a different value than both B and Merge: one side's change is lost in Merge",
        not_for: "Merge containing both changes",
        examples: ["Merge equals L and R's addition is gone"],
      },
      merge_introduces: {
        what: "B, L and R agree on x but Merge computes something else",
        not_for: "Merge equal to L or to R",
        examples: ["merge tool duplicates or relocates a statement"],
      },
      none: {
        what: "L and R do not interfere: changes are independent or compatible and Merge preserves both",
        not_for: "any of the three conditions above",
        examples: ["L adds a list entry, R changes an unrelated condition, Merge has both"],
      },
    },
  ),

  // Acoplamento como Score ordenado
  coupling: score(
    {
      question: "How strongly coupled are the semantic effects of L and R?",
      compare: ["`diffs.base_to_left`", "`diffs.base_to_right`"],
      focus: "Judge coupling of behaviour, not textual distance.",
    },
    [
      { what: "Independent", signals: ["Different elements", "No shared data or control flow"] },
      { what: "Same area, still independent", signals: ["Same method or block", "No shared state element"] },
      { what: "Semantically related", signals: ["Shared variable or contract", "One depends on the other's result"] },
      { what: "Direct conflict", signals: ["Same element changed differently", "One change cancels the other in Merge"] },
    ],
  ),

  // Riscos de execução do merge (apenas reportados; não entram no veredito)
  mergeBreaksCompilation: noul(
    {
      question: "Is the Merge likely to fail compilation (undefined or duplicate symbol, missing declaration, type mismatch)?",
      inspect: ["`diffs.left_to_merge`", "`diffs.right_to_merge`", "`facts.merge_only_lines`"],
      focus: "Only flag concrete evidence in the diffs.",
    },
    {
      true: yes("A concrete symbol or type problem is visible", ["a variable is used but its declaration was dropped"]),
      false: yes("No compile-time problem is visible", ["every referenced symbol is declared in B, L or R"]),
    },
  ),
  mergeBreaksRuntime: noul(
    {
      question: "Is the Merge likely to behave incorrectly at runtime relative to what L and R intended?",
      inspect: ["`diffs.left_to_merge`", "`diffs.right_to_merge`"],
      focus: "Consider lost changes, inconsistent constants and broken invariants.",
    },
    {
      true: yes("A visible mismatch between intended and merged behaviour", ["a count constant no longer matches the list it describes"]),
      false: yes("The merged behaviour matches the intent of both changes", ["Merge contains both changes consistently"]),
    },
  ),
};

// ───────────────────────── Decisão em código ─────────────────────────
type Answers = Record<string, any>;
type Weights = { cond1: number; cond2L: number; cond2R: number; cond3: number; kind: number; coupling: number };

const PRESETS: Record<string, Weights> = {
  balanced: { cond1: 0.2, cond2L: 0.2, cond2R: 0.2, cond3: 0.15, kind: 0.15, coupling: 0.1 },
  conditions: { cond1: 0.25, cond2L: 0.25, cond2R: 0.25, cond3: 0.15, kind: 0.1, coupling: 0 },
  verdict: { cond1: 0.1, cond2L: 0.1, cond2R: 0.1, cond3: 0.1, kind: 0.45, coupling: 0.15 },
  conservative: { cond1: 0.3, cond2L: 0.15, cond2R: 0.15, cond3: 0.1, kind: 0.2, coupling: 0.1 },
};

function features(a: Answers) {
  const pNone: number = a.kind.probabilities?.none ?? (a.kind.choice === "none" ? 1 : 0);
  return {
    cond1: a.cond1AllDiffer.noul as number,
    cond2L: a.cond2LeftNotPreserved.noul as number,
    cond2R: a.cond2RightNotPreserved.noul as number,
    cond3: a.cond3MergeIntroduces.noul as number,
    kind: 1 - pNone,
    coupling: (a.coupling.score as number) / 3, // 4 níveis (0..3) → 0..1
    behaviour: Math.max(a.leftChangesBehavior.noul as number, a.rightChangesBehavior.noul as number),
    kindConfidence: a.kind.confidence as number,
  };
}

function risk(a: Answers, w: Weights) {
  const f = features(a);
  if (f.behaviour < 0.2) return 0; // nenhuma mudança comportamental → nada a interferir
  const total = w.cond1 + w.cond2L + w.cond2R + w.cond3 + w.kind + w.coupling;
  return (f.cond1 * w.cond1 + f.cond2L * w.cond2L + f.cond2R * w.cond2R + f.cond3 * w.cond3 + f.kind * w.kind + f.coupling * w.coupling) / total;
}

type Verdict = "interfere" | "not_interfere" | "review";

function decide(a: Answers, w: Weights, threshold: number, reviewBand = 0.08, minConfidence = 0.35): { verdict: Verdict; risk: number } {
  const r = risk(a, w);
  const f = features(a);
  const nearBoundary = Math.abs(r - threshold) <= reviewBand;
  if (nearBoundary && f.kindConfidence < minConfidence) return { verdict: "review", risk: r };
  return { verdict: r >= threshold ? "interfere" : "not_interfere", risk: r };
}

// ───────────────────────── Execução com cache ─────────────────────────
const client = new TypeSafeClient();
const questionsHash = createHash("sha256").update(JSON.stringify(questions)).digest("hex").slice(0, 12);

async function ask(s: Scenario): Promise<{ answers: Answers; usage?: { input_tokens: number }; ms: number; cached: boolean }> {
  const key = createHash("sha256").update(JSON.stringify(s.state) + questionsHash).digest("hex").slice(0, 24);
  const file = join(CACHE_DIR, `${key}.json`);
  if (!REFRESH) {
    const cached = await maybe(file);
    if (cached) return { ...JSON.parse(cached), cached: true };
  }
  const t0 = performance.now();
  const res = await client.systemOne({ state: s.state, questions });
  const out = { answers: res.answers as Answers, usage: res.usage, ms: performance.now() - t0 };
  await writeFile(file, JSON.stringify(out));
  return { ...out, cached: false };
}

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, n) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

// ───────────────────────── Métricas ─────────────────────────
function metrics(rows: { truth: boolean; verdict: Verdict }[]) {
  const decided = rows.filter((r) => r.verdict !== "review");
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const r of decided) {
    const pred = r.verdict === "interfere";
    if (pred && r.truth) tp++;
    else if (pred && !r.truth) fp++;
    else if (!pred && r.truth) fn++;
    else tn++;
  }
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = (2 * precision * recall) / (precision + recall || 1);
  const accuracy = (tp + tn) / (decided.length || 1);
  return { n: rows.length, decided: decided.length, review: rows.length - decided.length, tp, fp, fn, tn, accuracy, precision, recall, f1 };
}
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const fmt = (m: ReturnType<typeof metrics>) => ({ ...m, accuracy: pct(m.accuracy), precision: pct(m.precision), recall: pct(m.recall), f1: pct(m.f1) });

// ───────────────────────── Principal ─────────────────────────
await mkdir(CACHE_DIR, { recursive: true });
await mkdir(RESULTS_DIR, { recursive: true });

const scenarios = await loadAll();
if (scenarios.length === 0) throw new Error(`Nenhum cenário encontrado em ${ROOT}`);
console.log(`Cenários: ${scenarios.length} (anotações source/sink: ${USE_ANNOTATIONS ? "ligadas" : "desligadas"})`);

const calls = await pool(scenarios, CONCURRENCY, async (s) => {
  if (s.trivial) return { s, answers: undefined as Answers | undefined, ms: 0, cached: true, tokens: 0 };
  const r = await ask(s);
  console.log(`  ${r.cached ? "cache" : `${r.ms.toFixed(0)}ms`}  ${s.id}`);
  return { s, answers: r.answers, ms: r.ms, cached: r.cached, tokens: r.usage?.input_tokens ?? 0 };
});

const DEFAULT_THRESHOLD = 0.7;
const DEFAULT_WEIGHTS = PRESETS.balanced;

const rows = calls.map(({ s, answers }) => {
  if (!answers) return { id: s.id, truth: s.interferes, verdict: "not_interfere" as Verdict, risk: 0, kind: "(atalho determinístico)" };
  const d = decide(answers, DEFAULT_WEIGHTS, DEFAULT_THRESHOLD);
  return { id: s.id, truth: s.interferes, verdict: d.verdict, risk: d.risk, kind: answers.kind.choice as string };
});

console.log("\nPor cenário:");
console.table(rows.map((r) => ({ cenário: r.id.slice(0, 70), real: r.truth ? "interfere" : "não interfere", previsto: r.verdict, risco: r.risk.toFixed(2), tipo: r.kind, ok: r.verdict === "review" ? "?" : (r.verdict === "interfere") === r.truth ? "✓" : "✗" })));

console.log("\nMétricas (pesos 'balanced', limiar 0.7):");
console.table([fmt(metrics(rows))]);

const totalTokens = calls.reduce((n, c) => n + c.tokens, 0);
const liveMs = calls.filter((c) => !c.cached).map((c) => c.ms);
console.log(`Tokens de entrada (chamadas novas + cache): ${totalTokens}` + (liveMs.length ? ` | latência média: ${(liveMs.reduce((a, b) => a + b, 0) / liveMs.length).toFixed(0)} ms` : ""));

// ── Ajuste offline: nenhuma chamada nova, só reponderar respostas já guardadas ──
if (TUNE) {
  const labelled = calls.filter((c) => c.answers).map((c) => ({ id: c.s.id, truth: c.s.interferes, answers: c.answers! }));
  const thresholds = Array.from({ length: 19 }, (_, i) => 0.05 + i * 0.05);
  const configs = Object.entries(PRESETS).flatMap(([name, w]) => thresholds.map((t) => ({ name, w, t })));

  const score_ = (subset: typeof labelled, c: { w: Weights; t: number }) =>
    metrics(subset.map((x) => ({ truth: x.truth, verdict: decide(x.answers, c.w, c.t, 0, 0).verdict }))).f1;

  const best = configs.reduce((b, c) => (score_(labelled, c) > score_(labelled, b) ? c : b), configs[0]);

  // leave-one-out: estimativa menos otimista que o F1 no próprio conjunto de ajuste
  let hits = 0;
  for (let i = 0; i < labelled.length; i++) {
    const train = labelled.filter((_, j) => j !== i);
    const bestTrain = configs.reduce((b, c) => (score_(train, c) > score_(train, b) ? c : b), configs[0]);
    const pred = decide(labelled[i].answers, bestTrain.w, bestTrain.t, 0, 0).verdict === "interfere";
    if (pred === labelled[i].truth) hits++;
  }

  console.log(`\nMelhor configuração: preset=${best.name}, limiar=${best.t.toFixed(2)}, F1 no conjunto=${pct(score_(labelled, best))}`);
  console.log(`Acurácia leave-one-out: ${pct(hits / (labelled.length || 1))}  (com poucos cenários, use este número, não o F1 acima)`);
  console.log("Pesos:", best.w);

  const tuned = labelled.map((x) => ({ truth: x.truth, ...decide(x.answers, best.w, best.t, 0, 0) }));
  console.table([fmt(metrics(tuned))]);
}

const out = join(RESULTS_DIR, `interference-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
await writeFile(
  out,
  JSON.stringify({ annotations: USE_ANNOTATIONS, questionsHash, weights: DEFAULT_WEIGHTS, threshold: DEFAULT_THRESHOLD, rows, metrics: metrics(rows), raw: calls.map((c) => ({ id: c.s.id, answers: c.answers })) }, null, 2),
);
console.log(`\nResultados salvos em ${out}`);
