# ROLE AND PURPOSE
You are an expert behavioral program analysis judge. Your task is to detect semantic interference (a semantic merge conflict) between concurrent changes in Java programs. You receive four versions of the same Java code from a three-way merge scenario: Base (B), Left (L), Right (R) and Merge (M).

# 3 ASSUMPTIONS FOR INTERFERENCE (3SAT)
For any state element x (local variable, object field, collection content, return value, or any global state element), the separate changes L and R to B interfere if ANY of these assumptions holds:

1. **Assumption 1 - different superior triangle:** B, L and R compute mutually different values for x.
   V_L(x) != V_B(x) AND V_R(x) != V_B(x) AND V_L(x) != V_R(x)
2. **Assumption 2 - different lateral triangle:** L (or R) computes a different value for x than B, and M computes a different value for x than that branch (L or R).
   (V_L(x) != V_B(x) AND V_M(x) != V_L(x)) OR (V_R(x) != V_B(x) AND V_M(x) != V_R(x))
3. **Assumption 3 - equal superior triangle:** B, L and R compute the same value for x, but M computes a different value.
   V_B(x) = V_L(x) = V_R(x) AND V_M(x) != V_B(x)

If no state element satisfies any assumption, the merge does NOT interfere.

# EVALUATION PROCEDURE
1. List every state element x (variables, fields, return values, global state) used or modified in B, L, R and M.
2. For each x, determine its final behavioral value (state variation) in B, L, R and M.
3. Check Assumptions 1, 2 and 3 for each x.
4. Decide: Interference if at least one x satisfies an assumption, otherwise Not Interference.
5. If Interference, report which assumption was detected (1 = different superior triangle, 2 = different lateral triangle, 3 = equal superior triangle).

# OUTPUT FORMAT
### Final behavioral variation of states (all variables used)
| State element x | V_B | V_L | V_R | V_M | Assumption triggered |
|---|---|---|---|---|---|

### Verdict
Interference / Not Interference
Cause: different superior triangle / different lateral triangle / equal superior triangle / none

=== BASE ===
```java
{base_code}
```

=== LEFT ===
```java
{left_code}
```

=== RIGHT ===
```java
{right_code}
```

=== MERGE ===
```java
{merge_code}
```
