# Jev TypeScript demo

Examples for using Jev, TypeSafe's System One model, with the TypeScript SDK.

## Setup

Requirements: Node.js 22+, TypeSafe access, and an API key.

```sh
npm ci
cp .env.example .env
```

Add your TypeSafe API key to `.env`. The file is ignored by Git.

## Jev best practices (and mistakes to avoid)

The scenarios are grouped into three parts: preparing the state, writing the
questions, and using the answers in your code. Each scenario has its own folder,
and the files inside it are numbered in the order to run them.

Run any file with the `scenario` script:

```sh
npm run scenario code/java/java_no-interference.ts
```

### 1. Experiment by Programing Language

| Dataset | Experiment | Result |
|---|---|---|
|`interference_java_toy_dataset`| `interference_java.ts` | `28-out-2026_inteference_java_toy_dataset`  |
|`no-interference_java_toy_dataset`| `no-interference_java.ts` | `28-out-2026_no-inteference_java_toy_dataset`  |
|`interference_javascript_toy_dataset`| `interference_javascript.ts` | `28-out-2026_inteference_javascript_toy_dataset`  |
|`no-interference_javascript_toy_dataset`| `no-interference_javascript.ts` | `28-out-2026_no-inteference_javascript_toy_dataset`  |
|`interference_python_toy_dataset`| `interference_python.ts` | `28-out-2026_inteference_python_toy_dataset`  |
|`no-interference_python_toy_dataset`| `no-interference_python.ts` | `28-out-2026_no-inteference_python_toy_dataset`  |


## Getting started examples

The two files at the root are from the introduction to Jev.

```sh
npm run demo
```

`demo.ts` asks whether a customer message sounds frustrated.

```sh
npm run all
```

`all-questions.ts` sends Noul, Choice, and Score questions together, then uses an
example threshold to decide whether to flag the message for review.

## Type checking

```sh
npm run check
```

Docs: https://docs.typesafe.ai/sdk/javascript
