#!/usr/bin/env python3
"""Métricas 3SAT: binária (interference / not_interference) e multiclasse
(different_superior_triangle / different_lateral_triangle / equal_superior_triangle / none_above).

Uso: python3 -I metrics_3sat.py <results-dir/variant> [--labels cause_labels.csv] [--threshold 0.5]
  cause_labels.csv (opcional): scenario,cause  (cause = rótulo verdadeiro; só cenários com interferência)
Otimização: varre limiares de P(interference) e escolhe o de maior F1 (desempate: maior recall).
Stdlib apenas.
"""
import argparse, csv, glob, json, os

CLS = ["different_superior_triangle", "different_lateral_triangle", "equal_superior_triangle", "none_above"]

def prf(tp, fp, fn, tn):
    d = lambda a, b: a / b if b else 0.0
    p, r = d(tp, tp + fp), d(tp, tp + fn)
    return dict(accuracy=d(tp + tn, tp + tn + fp + fn), precision=p, recall=r,
                f1=d(2 * p * r, p + r), specificity=d(tn, tn + fp), TP=tp, FP=fp, FN=fn, TN=tn)

def load(d):
    recs = []
    for f in sorted(glob.glob(os.path.join(d, "*.json"))):
        j = json.load(open(f))
        for r in j["records"]:
            if "conflict" in r:
                r["truth"] = j["kind"] == "interference"
                r["key"] = f"{j['kind']}/{r['scenario']}"
                recs.append(r)
    return recs

def binary(recs, t):
    tp = fp = fn = tn = 0
    for r in recs:
        pred = r["conflict"]["probabilities"]["interference"] >= t
        if r["truth"] and pred: tp += 1
        elif r["truth"]: fn += 1
        elif pred: fp += 1
        else: tn += 1
    return prf(tp, fp, fn, tn)

def multiclass_pred(r, t):
    """Binário decide interferência com limiar t; causa = argmax entre as 3 causas."""
    if r["conflict"]["probabilities"]["interference"] < t: return "none_above"
    p = r["interference"]["probabilities"]
    return max(CLS[:3], key=lambda c: p[c])

def multiclass(recs, labels, t):
    pairs = []
    for r in recs:
        truth = CLS[3] if not r["truth"] else labels.get(r["scenario"])
        if truth: pairs.append((truth, multiclass_pred(r, t)))
    out = {}
    for c in CLS:
        tp = sum(1 for y, p in pairs if y == c and p == c); fp = sum(1 for y, p in pairs if y != c and p == c)
        fn = sum(1 for y, p in pairs if y == c and p != c); tn = len(pairs) - tp - fp - fn
        out[c] = prf(tp, fp, fn, tn)
    n = len(pairs)
    macro = {m: sum(out[c][m] for c in CLS) / 4 for m in ("precision", "recall", "f1", "specificity")}
    macro["accuracy"] = sum(1 for y, p in pairs if y == p) / n if n else 0.0
    return out, macro, n

def row(name, m): return f"| {name} | {m['accuracy']:.3f} | {m['precision']:.3f} | {m['recall']:.3f} | {m['f1']:.3f} | {m['specificity']:.3f} |"
H = "| | Accuracy | Precision | Recall | F1 | Specificity |\n|---|---|---|---|---|---|"

ap = argparse.ArgumentParser(); ap.add_argument("dir"); ap.add_argument("--labels"); ap.add_argument("--threshold", type=float, default=0.5)
a = ap.parse_args()
recs = load(a.dir)
labels = {}
if a.labels:
    labels = {r["scenario"]: r["cause"] for r in csv.DictReader(open(a.labels))}
pos = sum(r["truth"] for r in recs)
print(f"# {a.dir}\n{len(recs)} cenários ({pos} interference, {len(recs)-pos} no-interference)\n")

sweep = [(t / 20, binary(recs, t / 20)) for t in range(1, 20)]
best_t, best = max(sweep, key=lambda x: (round(x[1]["f1"], 6), x[1]["recall"]))
print("## Varredura de limiar (binária)\n| t | Precision | Recall | F1 |\n|---|---|---|---|")
for t, m in sweep: print(f"| {t:.2f} | {m['precision']:.3f} | {m['recall']:.3f} | {m['f1']:.3f} |")
print(f"\nMelhor limiar (F1, desempate recall): **{best_t:.2f}**\n")

for title, t in (("limiar fixo", a.threshold), ("limiar otimizado", best_t)):
    m = binary(recs, t)
    print(f"## Binária ({title} = {t:.2f})\n{H}\n{row('interference vs not_interference', m)}\nTP={m['TP']} FP={m['FP']} FN={m['FN']} TN={m['TN']}\n")

t = best_t
per, macro, n = multiclass(recs, labels, t)
print(f"## Multiclasse (limiar {t:.2f}, {n} cenários com rótulo verdadeiro)")
if not labels:
    print("> Sem --labels: cenários com interferência não têm causa verdadeira; só 'none_above' é avaliável. "
          "Métricas por classe abaixo valem apenas para none_above; macro NÃO é confiável.")
print(H)
for c in CLS: print(row(c, per[c]))
print(row("macro", macro))
dist = {}
for r in recs:
    if r["truth"]: k = multiclass_pred(r, t); dist[k] = dist.get(k, 0) + 1
print(f"\nCausa prevista nos cenários com interferência: {dist}")
