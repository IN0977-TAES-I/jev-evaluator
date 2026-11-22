// Runner 3SAT: classifica cenários (interference / not_interference) e a causa
// (different_superior_triangle / different_lateral_triangle / equal_superior_triangle / none_above)
// com chamadas tipadas do Jev (client.systemOne + choice).
// Uso: tsx --env-file=.env run_3sat.ts --variant v2_optimized --datasets-dir .. [--clean] [--distinct] [--limit N]
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { cleanJava } from "./clean.ts";

const here = dirname(fileURLToPath(import.meta.url));
const { values } = parseArgs({
  options: {
    variant: { type: "string", default: "v2_optimized" }, // arquivo em prompt/pro-3sat/<variant>.md
    "datasets-dir": { type: "string", default: join(here, "..") },
    "results-dir": { type: "string", default: join(here, "results", "pro-3sat") },
    "name-template": { type: "string", default: "{kind}_reduced_mergedataset" },
    distinct: { type: "boolean", default: false }, // 1 pasta por número de cenário
    clean: { type: "boolean", default: false }, // remove comentários/package/import
    limit: { type: "string" }, // por dataset
    concurrency: { type: "string", default: "4" },
  },
});
if (!process.env.TYPESAFE_API_KEY) throw new Error("Defina TYPESAFE_API_KEY (.env ou ambiente).");

const template = await readFile(join(here, "prompt", "pro-3sat", `${values.variant}.md`), "utf8");
const client = new TypeSafeClient();
const limit = values.limit ? Number(values.limit) : Infinity;

const questions = {
  conflict: choice(
    "Based on the 3 assumptions, does the merge introduce interference and generate a semantic conflict?",
    {
      interference: "the changes cause interference",
      not_interference: "the changes do not cause interference",
    },
  ),
  interference: choice("Which assumption detects the interference?", {
    different_superior_triangle: "A1: B, L and R compute mutually different values for a state element.",
    different_lateral_triangle: "A2: L (or R) computes a different value than B, and Merge differs from that branch.",
    equal_superior_triangle: "A3: B, L and R compute the same value, but Merge computes a different value.",
    none_above: "None of the above: the merge preserves the behavior of both branches.",
  }),
};

const diff = async (dir: string, a: string, b: string, fa: string, fb: string) => {
  const r = spawnSync("diff", ["-u", "-U2", "--label", fa, "--label", fb, join(dir, `${fa}.java`), join(dir, `${fb}.java`)], {
    encoding: "utf8",
  });
  return r.stdout.trim() || "(no differences)";
};

async function readVars(sd: string) {
  const txt = await readFile(join(sd, "referenced-vars.txt"), "utf8").catch(() => "");
  const head = txt.split("# per-line detail")[0].trim();
  return head || "(not available)";
}

const fill = (t: string, m: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => m[k] ?? `{${k}}`);
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const work = await mkdtemp(join(tmpdir(), "3sat-"));

for (const kind of ["interference", "no-interference"]) {
  const name = values["name-template"]!.replaceAll("{kind}", kind);
  const dir = join(resolve(values["datasets-dir"]!), name);
  let scenarios = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && /^\d+S?(_|$)/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  scenarios = scenarios
    .filter((n, i, all) => !values.distinct || i === 0 || n.match(/^\d+/)![0] !== all[i - 1].match(/^\d+/)![0])
    .slice(0, limit);
  console.log(`\n=== ${name} (${scenarios.length}) variant=${values.variant} ===`);

  const run = async (scenario: string) => {
    const sd = join(dir, scenario);
    const tmp = await mkdtemp(join(work, "s-"));
    const code: Record<string, string> = {};
    for (const f of ["base", "left", "right", "merge"]) {
      const raw = await readFile(join(sd, `${f}.java`), "utf8");
      code[f] = values.clean ? cleanJava(raw) : raw;
      await writeFile(join(tmp, `${f}.java`), code[f]);
    }
    const message = fill(template, {
      base_code: code.base,
      left_code: code.left,
      right_code: code.right,
      merge_code: code.merge,
      variables: await readVars(sd),
      diff_base_left: await diff(tmp, "", "", "base", "left"),
      diff_base_right: await diff(tmp, "", "", "base", "right"),
      diff_left_merge: await diff(tmp, "", "", "left", "merge"),
      diff_right_merge: await diff(tmp, "", "", "right", "merge"),
    });
    const t0 = performance.now();
    try {
      const response: any = await client.systemOne({ state: { message }, questions });
      const a = response.answers;
      console.log(`${scenario}: ${a.conflict.choice} / ${a.interference.choice}`);
      return {
        scenario,
        kind,
        elapsedMs: Math.round(performance.now() - t0),
        conflict: { choice: a.conflict.choice, probabilities: a.conflict.probabilities },
        interference: { choice: a.interference.choice, probabilities: a.interference.probabilities },
      };
    } catch (e) {
      console.error(`${scenario}: falha -> ${e}`);
      return { scenario, kind, error: String(e) };
    }
  };

  const records: any[] = [];
  const queue = [...scenarios];
  const workers = Array.from({ length: Number(values.concurrency) }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) records.push(await run(s));
  });
  await Promise.all(workers);
  records.sort((a, b) => a.scenario.localeCompare(b.scenario, undefined, { numeric: true }));

  const outDir = join(resolve(values["results-dir"]!), values.variant!);
  await mkdir(outDir, { recursive: true });
  await writeFile(
    join(outDir, `${stamp}_${name}.json`),
    JSON.stringify({ dataset: name, kind, variant: values.variant, clean: values.clean, records }, null, 2),
  );
}
console.log(`\nResultados em ${join(resolve(values["results-dir"]!), values.variant!)}`);
