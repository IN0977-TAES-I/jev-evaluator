// Runner local do experimento "JEV as Judge" (substitui o notebook do Colab).
// Uso: tsx run.ts [--name-template "{kind}_reduced_mergedataset"] [--language java,python,javascript] [--kind interference,no-interference]
//                 [--datasets-dir ..] [--results-dir results] [--limit N]
import { choice, score, TypeSafeClient } from "@typesafe-ai/sdk";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { cleanJava } from "./clean.ts";
import { CSV_HEADER_PRO, rowsFromRun, rowsFromRunPro, toCsv } from "./csv.ts";

const LANGS: Record<string, { ext: string; fence: string }> = {
  java: { ext: "java", fence: "java" },
  python: { ext: "py", fence: "python" },
  javascript: { ext: "js", fence: "javascript" },
};
const KINDS = ["interference", "no-interference"] as const;

const here = dirname(fileURLToPath(import.meta.url));
const { values } = parseArgs({
  options: {
    language: { type: "string", default: Object.keys(LANGS).join(",") },
    kind: { type: "string", default: KINDS.join(",") },
    "datasets-dir": { type: "string", default: join(here, "..") },
    "results-dir": { type: "string", default: join(here, "results") },
    dataset: { type: "string", default: "toy" }, // toy | merge  -> <kind>_qwen_<lang>_<dataset>_dataset
    // Sobrescreve o nome da pasta do dataset. Ex.: "{kind}_reduced_mergedataset" (placeholders: {kind}, {language})
    "name-template": { type: "string" },
    // Uma pasta por número de cenário (001S_a, 001S_b -> só 001S_a). Para os *_reduced_mergedataset.
    distinct: { type: "boolean", default: false },
    // Ignora cenários cuja classe é de teste (nome *Test/*Tests/*TestCase/*IT ou marcadores JUnit no merge).
    // Combinado com --distinct, escolhe por número a primeira pasta que não é de teste.
    "exclude-tests": { type: "boolean", default: false },
    // Remove comentários e package/import do código Java (base/left/right/merge) antes de montar o prompt.
    clean: { type: "boolean", default: false },
    // Só lista os cenários que seriam rodados e sai (não chama a API).
    list: { type: "boolean", default: false },
    // Prompt/perguntas: "basic" (prompt original, chaves interfere/not_interfere) ou "pro" (prompt PRO do Gemini,
    // chaves interference/not_interference, subtipo com none_above, sem compile/runtime). Layout do EXP-017.
    prompt: { type: "string", default: "basic" },
    limit: { type: "string" },
    threshold: { type: "string", default: "0.7" }, // interfere se P(interfere) >= threshold
  },
});

if (!process.env.TYPESAFE_API_KEY) {
  console.error("Defina TYPESAFE_API_KEY (em .env ou no ambiente).");
  process.exit(1);
}

const languages = values.language!.split(",").map((s) => s.trim());
const kinds = values.kind!.split(",").map((s) => s.trim());
for (const l of languages) if (!LANGS[l]) throw new Error(`Linguagem inválida: ${l}`);
for (const k of kinds) if (!(KINDS as readonly string[]).includes(k)) throw new Error(`Tipo inválido: ${k}`);

const datasetsDir = resolve(values["datasets-dir"]!);
const resultsDir = resolve(values["results-dir"]!);
const limit = values.limit ? Number(values.limit) : Infinity;
const threshold = Number(values.threshold);
if (!(threshold > 0 && threshold < 1)) throw new Error("--threshold deve estar entre 0 e 1");
if (!["basic", "pro"].includes(values.prompt!)) throw new Error("--prompt deve ser basic ou pro");
const PRO = values.prompt === "pro";
const client = new TypeSafeClient();

// Classe de teste: sufixo do nome (ex.: SlimTableFactoryTest) ou marcadores JUnit no código.
// "TestScheduler" (rx) é produção, por isso não se usa o prefixo "Test".
function isTestScenario(dirName: string, mergeSource: string) {
  const cls = dirName.replace(/^\d+S?_[^_]*_/, "").replace(/_[^_]*$/, "");
  const simple = cls.split(".").pop() ?? cls;
  return /(Test|Tests|TestCase|IT)$/.test(simple) || /@(Test|Before|After)\b|extends\s+\w*TestCase|org\.junit/.test(mergeSource);
}

function buildMessage(fence: string, b: string, l: string, r: string, m: string) {
  const block = (title: string, code: string) => `${title}:\n\`\`\`${fence}\n${code}\n\`\`\``;
  return (
    "You are a static analysis expert detecting semantic interference in three-way merges.\n\n" +
    "Definition - L and R interfere if ANY of the following holds:\n" +
    "1. There is a state element x such that B, L and R compute different values for x.\n" +
    "2. There is a state element x such that L (or R) computes a different value for x than B and Merge.\n" +
    "3. There is a state element x such that B, L and R compute the same value for x but Merge computes a different value.\n\n" +
    [block("Base program B", b), block("Left change L", l), block("Right change R", r), block("Merged program Merge", m)].join("\n\n")
  );
}

// Prompt PRO (code/mergedataset/pro/gemini_*.ts) com 3 correções: "3-way" (era "4-way"), "$-" solto removido
// e barras duplicadas nas fórmulas (em string JS "\\neq" virava quebra de linha e "\\rightarrow" virava CR).
// O trecho "Final Choice/Verdict" do original nunca era enviado (faltava "+"), então não está aqui.
function buildProMessage(b: string, l: string, r: string, m: string) {
  const code = (title: string, c: string) => `${title}:\n\`\`\`java\n${c}\n\`\`\``;
  return (
    "# ROLE AND PURPOSE\n You are an expert behavorial program analysis judge. Your primary task is to act as a formal evaluator to detect semantic interference between concurrent code modifications in Java programs. You will be provided with four versions of Java code representing a 3-way merge scenario: Base (B), Left (L), Right (R), and Merge (M).\n" +
    "# DEFINITION OF SEMANTIC INTERFERENCE\n Semantic interference occurs when changes made independently in branch L and branch R interact in a way that produces unexpected state or behavioral side effects.  For any state element $x$ (e.g., local variables, object fields, return values, or global state elements), interference occurs if ANY of the following rules are satisfied:\n" +
    "1. **Rule 1 (Divergent Computation):** $B$, $L$, and $R$ compute mutually different values for $x$. \n" +
    "$$V_L(x) \\neq V_R(x) \\land V_L(x) \\neq V_B(x) \\land V_R(x) \\neq V_B(x)$$\n" +
    "2. **Rule 2 (Unintended Overwrite / Loss of Branch Change):** Either $L$ or $R$ computes a different value for $x$ than $B$, but $M$ (Merge) fails to preserve that change, computing a different value than the modifying branch.\n" +
    "$$(V_L(x) \\neq V_B(x) \\land V_M(x) \\neq V_L(x)) \\quad \\lor \\quad (V_R(x) \\neq V_B(x) \\land V_M(x) \\neq V_R(x))$$\n" +
    "3. **Rule 3 (Emergent Behavior / Merge Anomaly):** $B$, $L$, and $R$ all compute the *same* value for $x$, but $M$ (Merge) computes a *different* value for $x$.\n" +
    "$$(V_B(x) = V_L(x) = V_R(x)) \\land V_M(x) \\neq V_B(x)$$\n" +
    "# EVALUATION PROCEDURE \n" +
    "For each scenario provided:1. Identify State Elements: Identify all relevant variables, attributes, fields, and return expressions modified or impacted across $B$, $L$, $R$, and $M$.\n" +
    "2. Trace State Transitions: Perform symbolic or abstract mental execution to determine the dynamic/static values assigned to state element $x$ across all 4 versions.\n" +
    "3. Apply Rules: Check if state element $x$ violates Rule 1, Rule 2, or Rule 3.\n" +
    "4. Formulate Verdict: - If ANY state element satisfies Rule 1, 2, or 3 \n" +
    "$\\rightarrow$ Interference \n" +
    "- If NO state element satisfies Rule 1, 2, or 3 \n" +
    "$\\rightarrow$ Not Interference\n" +
    "# ANALYSIS BREAKDOWN \n" +
    "Your output MUST follow this structured markdown template strictly\n" +
    "State Elements Evaluated:[List variables/fields analyzed]\n" +
    "Branch Tracing ($B, L, R, M$):\n" +
    "- Base ($B$): [State values calculated]\n" +
    "- Left ($L$): [State values calculated]\n" +
    "- Right ($R$): [State values calculated]\n" +
    "- Merge ($M$): [State values calculated]\n" +
    "Rule Violations:\n" +
    "- Rule 1: [Triggered / Not Triggered] — [Explanation]\n" +
    "- Rule 2: [Triggered / Not Triggered] — [Explanation]\n" +
    "- Rule 3: [Triggered / Not Triggered] — [Explanation]\n" +
    [code("Base program B", b), code("Left change L", l), code("Right change R", r), code("Merged program Merge", m)].join("\n\n")
  );
}

const proQuestions = {
  conflict: choice("Based on the assumptions, does the merge introduces interference and generate semantics conflict?", {
    interference: "the changes cause interference",
    not_interference: "the changes do not cause interference",
  }),
  interference: choice("Which kind of interference is present?", {
    different_superior_triangle: "1. B, L, and R compute different values for a state element.",
    different_lateral_triangle: "2. L or R computes a different value than B and Merge.",
    equal_superior_triangle: "3. B, L, and R compute the same value, but Merge computes a different value.",
    none_above: "Preserve the behavior",
  }),
};

const questions = {
  conflict: choice("Do the separate changes L and R interfere with each other?", {
    interfere: "the changes interfere",
    not_interfere: "the changes do not interfere",
  }),
  inferfere: choice("Which kind of interference is present?", {
    diferent_superior_triangle: "1. B, L, and R compute different values for a state element.",
    diferent_lateral_triangle: "2. L or R computes a different value than B and Merge.",
    equal_superior_triangle: "3. B, L, and R compute the same value, but Merge computes a different value.",
  }),
  compile: score("How confident are you that the merge does not cause a compile-time bug?", ["Low", "Medium", "High"]),
  runtime: score("How confident are you that the merge does not cause a runtime bug?", ["Low", "Medium", "High"]),
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const summary: unknown[] = [];
const csvRows: string[][] = [];

for (const language of languages) {
  const { ext, fence } = LANGS[language];
  for (const kind of kinds) {
    const name = values["name-template"]
      ? values["name-template"].replaceAll("{kind}", kind).replaceAll("{language}", language)
      : `${kind}_qwen_${language}_${values.dataset}_dataset`;
    const dir = join(datasetsDir, name);
    let scenarios: string[];
    try {
      scenarios = (await readdir(dir, { withFileTypes: true }))
        .filter((e) => e.isDirectory() && /^\d+S?(_|$)/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      if (values["exclude-tests"]) {
        const keep: string[] = [];
        for (const n of scenarios) {
          const src = await readFile(join(dir, n, `merge.${ext}`), "utf8").catch(() => "");
          if (!isTestScenario(n, src)) keep.push(n);
        }
        scenarios = keep;
      }
      scenarios = scenarios
        .filter((n, i, all) => !values.distinct || i === 0 || n.match(/^\d+/)![0] !== all[i - 1].match(/^\d+/)![0])
        .slice(0, limit);
    } catch {
      console.error(`Dataset não encontrado, pulando: ${dir}`);
      continue;
    }

    if (values.list) {
      console.log(`\n=== ${name} (${scenarios.length} cenários) ===\n${scenarios.join("\n")}`);
      continue;
    }
    const expected = PRO
      ? kind === "interference" ? "interference" : "not_interference"
      : kind === "interference" ? "interfere" : "not_interfere";
    const records: any[] = [];
    let correct = 0;
    console.log(`\n=== ${name} (${scenarios.length} cenários) ===`);

    for (const scenario of scenarios) {
      const sd = join(dir, scenario);
      const [b, l, r, m] = (
        await Promise.all(["base", "left", "right", "merge"].map((f) => readFile(join(sd, `${f}.${ext}`), "utf8")))
      ).map((code) => (values.clean && ext === "java" ? cleanJava(code) : code));
      const startedAt = performance.now();
      try {
        const response: any = await client.systemOne({
          state: { message: PRO ? buildProMessage(b, l, r, m) : buildMessage(fence, b, l, r, m) },
          questions: PRO ? proQuestions : questions,
        });
        const elapsedMs = Math.round(performance.now() - startedAt);
        const rawChoice = response.answers.conflict.choice;
        const probs = response.answers.conflict.probabilities;
        // PRO: critério da planilha (EXP-006/017) -> a classe escolhida precisa ter P >= limiar; senão conta como erro.
        const predicted = PRO
          ? probs[rawChoice] >= threshold ? rawChoice : "undecided"
          : probs.interfere >= threshold ? "interfere" : "not_interfere";
        const ok = predicted === expected;
        if (ok) correct++;
        records.push({ scenario, expected, rawChoice, predicted, threshold, correct: ok, elapsedMs, response });
        console.log(`${scenario}: ${predicted} ${ok ? "OK" : "ERRO"} (${elapsedMs} ms)`);
      } catch (e) {
        records.push({ scenario, expected, error: String(e) });
        console.error(`${scenario}: falha -> ${e}`);
      }
    }

    const accuracy = scenarios.length ? correct / scenarios.length : 0;
    console.log(`Acurácia: ${correct}/${scenarios.length} (${(accuracy * 100).toFixed(1)}%)`);
    const outDir = join(resultsDir, language, name);
    await mkdir(outDir, { recursive: true });
    const out = { dataset: name, language, kind, prompt: values.prompt, clean: values.clean, expected, total: scenarios.length, correct, accuracy, records };
    await writeFile(join(outDir, `${stamp}_${name}.json`), JSON.stringify(out, null, 2));
    csvRows.push(...(PRO ? rowsFromRunPro(out) : rowsFromRun(out)));
    summary.push({ dataset: name, total: scenarios.length, correct, accuracy });
  }
}

if (values.list) process.exit(0); // --list não grava resultados
await mkdir(resultsDir, { recursive: true });
const csvPath = join(resultsDir, `${stamp}_results.csv`);
await writeFile(csvPath, toCsv(csvRows, PRO ? CSV_HEADER_PRO : undefined));
console.log(`\nCSV: ${csvPath}`);

console.log("\n=== Resumo ===");
console.table(summary);
