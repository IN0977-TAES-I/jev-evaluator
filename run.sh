#!/usr/bin/env bash
# Roda o experimento localmente. Ex.: ./run.sh --language java --kind interference
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
[ -f .env ] || { echo "Crie .env a partir de .env.example com sua TYPESAFE_API_KEY"; exit 1; }
exec npx tsx --env-file=.env run.ts "$@"
