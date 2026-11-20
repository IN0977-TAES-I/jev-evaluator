import { choice, score, TypeSafeClient } from "@typesafe-ai/sdk";
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
  "no-interference_reduced_mergedataset",
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
    // Role and Purpose 
    "# ROLE AND PURPOSE\n You are an expert behavorial program analysis judge. Your primary task is to act as a formal evaluator to detect semantic interference between concurrent code modifications in Java programs. You will be provided with four versions of Java code representing a 4-way merge scenario: Base (B), Left (L), Right (R), and Merge (M).\n" +

    // Definition of semantic interference
    "# DEFINITION OF SEMANTIC INTERFERENCE\n Semantic interference occurs when changes made independently in branch L and branch R interact in a way that produces unexpected state or behavioral side effects.  For any state element $x$ (e.g., local variables, object fields, return values, or global state elements), interference occurs if ANY of the following rules are satisfied:\n" +
    
    //Definition of Semantic Interference
    "1. **Rule 1 (Divergent Computation):** $B$, $L$, and $R$ compute mutually different values for $x$. \n" +
    "$$V_L(x) \neq V_R(x) \land V_L(x) \neq V_B(x) \land V_R(x) \neq V_B(x)$$\n" +
    "2. **Rule 2 (Unintended Overwrite / Loss of Branch Change):** Either $L$ or $R$ computes a different value for $x$ than $B$, but $M$ (Merge) fails to preserve that change, computing a different value than the modifying branch.\n" +
    "$$(V_L(x) \neq V_B(x) \land V_M(x) \neq V_L(x)) \quad \lor \quad (V_R(x) \neq V_B(x) \land V_M(x) \neq V_R(x))$$\n" +
    "3. **Rule 3 (Emergent Behavior / Merge Anomaly):** $B$, $L$, and $R$ all compute the *same* value for $x$, but $M$ (Merge) computes a *different* value for $x$.\n" +
    "$$(V_B(x) = V_L(x) = V_R(x)) \land V_M(x) \neq V_B(x)$$\n" +
    
    //Evaluation Procedure
    "# EVALUATION PROCEDURE \n" +
    "For each scenario provided:1. Identify State Elements: Identify all relevant variables, attributes, fields, and return expressions modified or impacted across $B$, $L$, $R$, and $M$.\n" +
    "2. Trace State Transitions: Perform symbolic or abstract mental execution to determine the dynamic/static values assigned to state element $x$ across all 4 versions.\n" +
    "3. Apply Rules: Check if state element $x$ violates Rule 1, Rule 2, or Rule 3.\n" +
    "4. Formulate Verdict: - If ANY state element satisfies Rule 1, 2, or 3 \n" +
    "$\rightarrow$ Interference \n" +
    "$- If NO state element satisfies Rule 1, 2, or 3 \n" +
    "$\rightarrow$ Not Interference\n"  +
    
    "# ANALYSIS BREAKDOWN \n" +
    "Your output MUST follow this structured markdown template strictly\n"+
    "State Elements Evaluated:[List variables/fields analyzed]\n" +
    "Branch Tracing ($B, L, R, M$):\n" +
    "- Base ($B$): [State values calculated]\n" +
    "- Left ($L$): [State values calculated]\n" +
    "- Right ($R$): [State values calculated]\n" +
    "- Merge ($M$): [State values calculated]\n" +
    
    "Rule Violations:\n" +
    "- Rule 1: [Triggered / Not Triggered] — [Explanation]\n" +
    "- Rule 2: [Triggered / Not Triggered] — [Explanation]\n"+
    "- Rule 3: [Triggered / Not Triggered] — [Explanation]\n" +
    
    "Base program B:\n```java\n" +
    base +
    "\n```\n\nLeft change L:\n```java\n" +
    left +
    "\n```\n\nRight change R:\n```java\n" +
    right +
    "\n```\n\nMerged program Merge:\n```java\n" +
    merge +
    "\n```"
    
    "Final Choice\n" +
    "Verdict:[Interference / Not Interference]";
    

 
    

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
      interference: choice("Which kind of interference is present?", {
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
