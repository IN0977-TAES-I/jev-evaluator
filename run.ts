// Runner local do experimento "JEV as Judge" (substitui o notebook do Colab).
// Uso: tsx run.ts [--language java,python,javascript] [--kind interference,no-interference]
//                 [--datasets-dir ..] [--results-dir results] [--limit N]
import { choice, score, TypeSafeClient } from "@typesafe-ai/sdk";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { rowsFromRun, toCsv } from "./csv.ts";

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
    limit: { type: "string" },
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
const client = new TypeSafeClient();

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
    const name = `${kind}_qwen_${language}_toy_dataset`;
    const dir = join(datasetsDir, name);
    let scenarios: string[];
    try {
      scenarios = (await readdir(dir, { withFileTypes: true }))
        .filter((e) => e.isDirectory() && /^\d+S$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .slice(0, limit);
    } catch {
      console.error(`Dataset não encontrado, pulando: ${dir}`);
      continue;
    }

    const expected = kind === "interference" ? "interfere" : "not_interfere";
    const records: any[] = [];
    let correct = 0;
    console.log(`\n=== ${name} (${scenarios.length} cenários) ===`);

    for (const scenario of scenarios) {
      const sd = join(dir, scenario);
      const [b, l, r, m] = await Promise.all(
        ["base", "left", "right", "merge"].map((f) => readFile(join(sd, `${f}.${ext}`), "utf8")),
      );
      const startedAt = performance.now();
      try {
        const response: any = await client.systemOne({
          state: { message: buildMessage(fence, b, l, r, m) },
          questions,
        });
        const elapsedMs = Math.round(performance.now() - startedAt);
        const predicted = response.answers.conflict.choice;
        const ok = predicted === expected;
        if (ok) correct++;
        records.push({ scenario, expected, predicted, correct: ok, elapsedMs, response });
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
    const out = { dataset: name, language, kind, expected, total: scenarios.length, correct, accuracy, records };
    await writeFile(join(outDir, `${stamp}_${name}.json`), JSON.stringify(out, null, 2));
    csvRows.push(...rowsFromRun(out));
    summary.push({ dataset: name, total: scenarios.length, correct, accuracy });
  }
}

await mkdir(resultsDir, { recursive: true });
const csvPath = join(resultsDir, `${stamp}_results.csv`);
await writeFile(csvPath, toCsv(csvRows));
console.log(`\nCSV: ${csvPath}`);

console.log("\n=== Resumo ===");
console.table(summary);
