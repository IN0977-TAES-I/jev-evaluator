import { choice, score, TypeSafeClient, noul } from "@typesafe-ai/sdk";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.TYPESAFE_API_KEY) {
  console.error("Add your TypeSafe API key to .env before running the demo.");
  process.exit(1);
}

const client = new TypeSafeClient();
const scenariosDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  "interference_qwen_java_toy_dataset",
);
const scenarios = (await readdir(scenariosDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d+S_?/.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

if (scenarios.length === 0) {
  throw new Error(`No scenario folders found in ${scenariosDirectory}`);
}

for (const scenario of scenarios) {
  const scenarioDirectory = join(scenariosDirectory, scenario);
  const [base, left, right, merge] = await Promise.all([
    readFile(join(scenarioDirectory, "base.java"), "utf8"),
    readFile(join(scenarioDirectory, "left.java"), "utf8"),
    readFile(join(scenarioDirectory, "right.java"), "utf8"),
    readFile(join(scenarioDirectory, "merge.java"), "utf8"),
  ]);

  const message =
    "Role: You are an expert behavorial interference analyzer in Java detecting merge semantics conflicts.\n" +
    "Assumptions for Interference:\nFor any state element $x$ (e.g., local variables, object fields, return values, or global state elements).\n" +
    "Definition - L and R interfere if ANY of the following holds:\n" +
    "1. There is a state element x such that B, L and R compute different values for x.\n" +
    "2. There is a state element x such that L (or R) computes a different value for x than B and Merge.\n" +
    "3. There is a state element x such that B, L and R compute the same value for x but Merge computes a different value.\n\n" +
    "Analyze the following files:\nBase program B:\n```java\n" +
    base +
    "\n```\n\nLeft change L:\n```java\n" +
    left +
    "\n```\n\nRight change R:\n```java\n" +
    right +
    "\n```\n\nMerged program Merge:\n```java\n" +
    merge +
    "\n```" + 
    "Question:Based on the assumptions, does the merge introduces interference and generate semantics conflict?\n";
    "Return the label: (interference/ not_nterference)?" + 
    "Return the cause: different_superior_triangle / different_lateral_triangle / equal_superior_triangle / none"
    ;

  const state = {
    message,
  };

  const startedAt = performance.now();
  const response = await client.systemOne({
    state,
    questions: {
      conflict: choice("Based on the assumptions, does the merge introduces interference and generate semantics conflict?", {
        interference: "the changes cause interference",
        not_interference: "the changes do not cause interference",
      }),
      interference: choice("if there is interference, which kind of interference is present?", {
        different_superior_triangle: "1. B, L, and R compute different values for a state element.",
        different_lateral_triangle: "2. L or R computes a different value than B and Merge.",
        equal_superior_triangle: "3. B, L, and R compute the same value, but Merge computes a different value.",
        none_above: "Preserve the behavior"
      }),

      //compile: score("How confident are you that the merge does not cause a compile-time bug?", ["Low", "Medium", "High"]),
      //runtime: score("How confident are you that the merge does not cause a runtime bug?", ["Low", "Medium", "High"]),
    },
  });
  const elapsedMs = performance.now() - startedAt;

  console.log(`Scenario: ${scenario}`);
  console.dir(response, { depth: null });
  console.log(`Elapsed: ${elapsedMs.toFixed(0)} ms`);
}
