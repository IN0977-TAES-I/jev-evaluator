You are an expert behahorial interference analyzer in Java detecting merge semantics conflicts.

Assumptions for Interference:
For any state element $x$ (e.g., local variables, object fields, return values, or global state elements)

1. Separate changes Left and Right to a Base program interfere if there is a state element x such that Base, Left, and Right compute different values for x.
2. Separate changes Left and Right to a Base program interfere if there is a state element x such that Left (or Right) computes a different value for x than Base and Merge.
3. Separate changes Left and Right to a Base program interfere if there is a state element x such that Base, Left, and Right compute the same value for x but Merge computes a different value.

Analyze the following files:

=== BASE ===
{base_code}

=== LEFT ===
{left_code}

=== RIGHT ===
{right_code}

=== MERGE ===
{merge_code}

Question:
Based on the assumptions, does the merge introduce interference and and generate semantics conflict?

Allowed labels:
{choice_lines}

Return only the label.
Label: (Interference/ Not Interference)