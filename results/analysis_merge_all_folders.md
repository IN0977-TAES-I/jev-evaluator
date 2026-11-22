# Merge Dataset (reduced), 1 pasta = 1 cenário (EXP-008 round 3, EXP-009 round 4)

Datasets: `interference_reduced_mergedataset@db7358f` (16 pastas) e `no-interference_reduced_mergedataset@ad5f803` (102 pastas) = 118 cenários, incluindo classes de teste. Resultados brutos em `results/merge-all/round3` e `round4`.

Comando: `./run.sh --language java --name-template "{kind}_reduced_mergedataset" --results-dir results/merge-all/roundN`

## Critérios

- **B (oficial, o da planilha do Richardson):** TP se `choice=interfere` e `confidence>0.7`; TN se `choice=not_interfere` e `confidence>0.7`. O restante conta como FN/FP.
- A: P(interfere) >= 0.7 (usado antes). C: classe escolhida (argmax). Comparativos.

| Round | Critério | TP | FN | TN | FP |
|---|---|---|---|---|---|
| 3 (EXP-008) | **B** | 1 | 15 | 23 | 79 |
| | A | 3 | 13 | 87 | 15 |
| | C | 5 | 11 | 61 | 41 |
| 4 (EXP-009) | **B** | 1 | 15 | 19 | 83 |
| | A | 4 | 12 | 86 | 16 |
| | C | 5 | 11 | 64 | 38 |

No critério B, a maioria dos "FP" são `not_interfere` com confiança <= 0.7 (e não `interfere` errados); ver C para os erros de classe.
