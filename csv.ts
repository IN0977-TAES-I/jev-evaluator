// Gera o CSV no formato das tabelas do experimento (uma linha por cenário).
// Uso standalone: tsx csv.ts [results-dir]  -> usa o JSON mais recente de cada dataset.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CSV_HEADER = [
  "Language", "Status", "Scenario", "conflict.choice", "conflict.confidence",
  "conflict.probabilities.interfere", "conflict.probabilities.not_interfere", "interfere.choice", "verdict@threshold",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// `run` é o objeto salvo em results/<lang>/<dataset>/*.json
export function rowsFromRun(run: any, threshold = 0.7): string[][] {
  const status = run.kind === "interference" ? "Interference" : "No-Interference";
  return run.records.filter((r: any) => r.response).map((r: any) => {
    const a = r.response.answers;
    const c = a.conflict;
    return [
      cap(run.language), status, r.scenario, c.choice, String(c.confidence),
      String(c.probabilities.interfere), String(c.probabilities.not_interfere),
      // o subtipo só faz sentido quando há interferência
      c.choice === "interfere" ? a.inferfere.choice : "",
      c.probabilities.interfere >= threshold ? "interfere" : "not_interfere",
    ];
  });
}

// Layout do EXP-017 (prompt PRO): colunas G..P da planilha.
export const CSV_HEADER_PRO = [
  "Status", "Scenario", "conflict.choice", "conflict.confidence", "conflict.probabilities.interference",
  "conflict.probabilities.not_interference", "interference.choice", "interference.confidence",
  "interference.probabilities.different_superior_triangle", "interference.probabilities.different_lateral_triangle",
  "interference.probabilities.equal_superior_triangle", "interference.probabilities.none_above",
];

export function rowsFromRunPro(run: any): string[][] {
  const status = run.kind === "interference" ? "Interference" : "No-Interference";
  return run.records.filter((r: any) => r.response).map((r: any) => {
    const { conflict: c, interference: i } = r.response.answers;
    const p = i.probabilities;
    return [
      status, r.scenario, c.choice, String(c.confidence), String(c.probabilities.interference),
      String(c.probabilities.not_interference), i.choice, String(i.confidence),
      String(p.different_superior_triangle), String(p.different_lateral_triangle),
      String(p.equal_superior_triangle), String(p.none_above),
    ];
  });
}

export const toCsv = (rows: string[][], header: string[] = CSV_HEADER) =>
  [header, ...rows].map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(",")).join("\n") + "\n";

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
