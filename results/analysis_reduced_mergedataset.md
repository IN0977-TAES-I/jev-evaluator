# Análise: reduced mergedataset (EXP-008 round 3, EXP-009 round 4)

Datasets: `interference_reduced_mergedataset@db7358f` (13 cenários) e `no-interference_reduced_mergedataset@ad5f803` (64 cenários), 1 pasta por número de cenário (`--distinct`). Modelo: Jev (TypeSafe), prompt Basic, limiar 0.7 sobre P(interfere).

## Métricas (limiar 0.7)

| Round | TP | FN | TN | FP | Precisão | Recall | F1 | Acurácia | Acurácia balanceada |
|---|---|---|---|---|---|---|---|---|---|
| 3 (EXP-008) | 3 | 10 | 56 | 8 | 0.27 | 0.23 | 0.25 | 0.77 | 0.55 |
| 4 (EXP-009) | 1 | 12 | 55 | 9 | 0.10 | 0.08 | 0.09 | 0.73 | 0.47 |

A acurácia geral é inflada pela classe sem interferência (64 de 77 cenários). A acurácia balanceada (~0.5) mostra que o modelo está perto do acaso na tarefa.

## Sensibilidade ao limiar (TP de 13 / FP de 64)

| Limiar | Round 3 | Round 4 |
|---|---|---|
| 0.3 | 8 / 37 | 8 / 40 |
| 0.4 | 6 / 32 | 7 / 33 |
| 0.5 | 4 / 26 | 6 / 22 |
| 0.6 | 3 / 18 | 4 / 16 |
| 0.7 | 3 / 8 | 1 / 9 |
| 0.8 | 1 / 3 | 1 / 3 |

Nenhum limiar separa bem as classes: cada TP a mais custa vários FP.

## Estabilidade entre rounds

- Mesma decisão nos dois rounds: 11/13 (interference) e 61/64 (no-interference).
- FP nos dois rounds: 002S (elasticsearch), 016S (retrofit), 019S (quickml), 020S (pushy), 022S (swagger-core), 029S (orientdb), 056S (MPAndroidChart). Valem revisão manual do rótulo.
- Detectados com interferência: 007S (OpenTripPlanner, nos dois rounds), 010S (resty-gwt) e 011S (swagger-maven-plugin) no round 3.
- Os 6 cenários de jsoup (3 números x 2 rounds) tiveram P(interfere) entre 0.07 e 0.44.

## Observações

- O subtipo previsto nas 13 interferências do round 3 ficou em `diferent_lateral_triangle` (7) e `diferent_superior_triangle` (6); nenhum `equal_superior_triangle`.
- Os 8 a 9 FP por round estão concentrados em 8 projetos, sem um projeto dominante.
- Hipótese a verificar: com classes reduzidas (sem imports) o modelo perde o contexto necessário para ver a interferência.
