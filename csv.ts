// Gera o CSV no formato das tabelas do experimento (uma linha por cenário).
// Uso standalone: tsx csv.ts [results-dir]  -> usa o JSON mais recente de cada dataset.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CSV_HEADER = [
  "Language", "Status", "Scenario", "conflict.choice", "conflict.confidence",
  "conflict.probabilities.interfere", "conflict.probabilities.not_interfere", "interfere.choice",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// `run` é o objeto salvo em results/<lang>/<dataset>/*.json
export function rowsFromRun(run: any): string[][] {
  const status = run.kind === "interference" ? "Interference" : "No-Interference";
  return run.records.filter((r: any) => r.response).map((r: any) => {
    const a = r.response.answers;
    const c = a.conflict;
    return [
      cap(run.language), status, r.scenario, c.choice, String(c.confidence),
      String(c.probabilities.interfere), String(c.probabilities.not_interfere),
      // o subtipo só faz sentido quando há interferência
      c.choice === "interfere" ? a.inferfere.choice : "",
    ];
  });
}

export const toCsv = (rows: string[][]) =>
  [CSV_HEADER, ...rows].map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(",")).join("\n") + "\n";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const here = dirname(fileURLToPath(import.meta.url));
  const resultsDir = resolve(process.argv[2] ?? join(here, "results"));
  const rows: string[][] = [];
  for (const lang of ["java", "python", "javascript"]) {
    for (const kind of ["interference", "no-interference"]) {
      const dir = join(resultsDir, lang, `${kind}_qwen_${lang}_toy_dataset`);
      const files = (await readdir(dir).catch(() => [] as string[])).filter((f) => /^\d{4}-.*\.json$/.test(f)).sort();
      if (!files.length) continue;
      rows.push(...rowsFromRun(JSON.parse(await readFile(join(dir, files.at(-1)!), "utf8"))));
    }
  }
  const out = join(resultsDir, "results.csv");
  await writeFile(out, toCsv(rows));
  console.log(`${rows.length} linhas -> ${out}`);
}
