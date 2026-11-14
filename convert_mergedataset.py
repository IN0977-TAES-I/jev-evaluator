#!/usr/bin/env python3
"""Converte o spgroup/mergedataset para o formato lido pelo run.ts.

Entrada : <mergedataset>/<projeto>/<commit>/source/<pacote>/<Classe>/{base,left,right,merge}.java
          + semantic-conflicts/sample-semantic-conflicts.csv (rótulos)
Saída   : <out-dir>/interference_qwen_java_merge_dataset/NNNS/{base,left,right,merge}.java
          <out-dir>/no-interference_qwen_java_merge_dataset/NNNS/...
          <out-dir>/merge_dataset_manifest.csv  (NNNS -> projeto/commit/classe/rótulo)

Rótulo: coluna "Locally Observable Interference" do CSV (Yes -> interference, No -> no-interference).
Cenários sem rótulo (linha ausente no CSV ou "-"), incompletos ou acima de --max-bytes são ignorados
e listados no resumo.

Uso: python3 convert_mergedataset.py [--dataset-dir ../mergedataset] [--out-dir ..] [--max-bytes 100000] [--dry-run]
"""
import argparse
import csv
import shutil
from pathlib import Path

FILES = ("base", "left", "right", "merge")
LABELS = {"yes": "interference", "no": "no-interference"}


def load_labels(csv_path: Path):
    rows = list(csv.reader(csv_path.open(encoding="utf-8")))
    header = [c.strip() for c in rows[0]]
    labels = {}
    for r in rows[1:]:
        if not r:
            continue
        d = dict(zip(header, (c.strip() for c in r)))
        labels[(d["Commit"], d["Class"])] = d
    return labels


def main():
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset-dir", default=str(here.parent / "mergedataset"))
    ap.add_argument("--out-dir", default=str(here.parent))
    ap.add_argument("--max-bytes", type=int, default=100_000, help="ignora cenários com algum arquivo maior que isso")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    src_root = Path(a.dataset_dir)
    out_root = Path(a.out_dir)
    labels = load_labels(src_root / "semantic-conflicts" / "sample-semantic-conflicts.csv")

    found = []  # (projeto, commit, classe, dir)
    for merge in sorted(src_root.glob("*/*/source/**/merge.java")):
        rel = merge.relative_to(src_root).parts
        project, commit = rel[0], rel[1]
        found.append((project, commit, ".".join(rel[3:-1]), merge.parent))

    kept = {"interference": [], "no-interference": []}
    skipped = {"incompleto": [], "sem rótulo": [], "grande": []}
    for project, commit, cls, d in found:
        if not all((d / f"{f}.java").is_file() for f in FILES):
            skipped["incompleto"].append((project, commit, cls))
            continue
        row = labels.get((commit, cls))
        kind = LABELS.get(row["Locally Observable Interference"].lower()) if row else None
        if not kind:
            skipped["sem rótulo"].append((project, commit, cls))
            continue
        if max((d / f"{f}.java").stat().st_size for f in FILES) > a.max_bytes:
            skipped["grande"].append((project, commit, cls))
            continue
        kept[kind].append((project, commit, cls, d, row))

    manifest = []
    for kind, items in kept.items():
        out = out_root / f"{kind}_qwen_java_merge_dataset"
        if not a.dry_run:
            if out.exists():
                shutil.rmtree(out)
            out.mkdir(parents=True)
        for i, (project, commit, cls, d, row) in enumerate(items, 1):
            sid = f"{i:03d}S"
            if not a.dry_run:
                (out / sid).mkdir()
                for f in FILES:
                    shutil.copyfile(d / f"{f}.java", out / sid / f"{f}.java")
            manifest.append([kind, sid, project, commit, cls, row["Sample"], row["Manually Analyzed"]])

    if not a.dry_run:
        with (out_root / "merge_dataset_manifest.csv").open("w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["kind", "scenario", "project", "commit", "class", "sample", "manually_analyzed"])
            w.writerows(manifest)

    print(f"classes encontradas: {len(found)}  ({len({(p, c) for p, c, _, _ in found})} merges)")
    for k, v in kept.items():
        print(f"  {k}: {len(v)}")
    for k, v in skipped.items():
        print(f"  ignorados ({k}): {len(v)}")
    for t in skipped["grande"]:
        print("    grande:", *t)
    print("(dry-run: nada escrito)" if a.dry_run else f"escrito em {out_root}")


if __name__ == "__main__":
    main()
