#!/usr/bin/env sh
set -eu

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example to .env and complete it first."
  exit 1
fi

for command in docker openssl; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Missing required command: $command"
    exit 1
  fi
done

docker compose config >/dev/null
docker compose build --pull
docker compose up -d
docker compose ps

echo "Deployment started. Confirm that ports 80 and 443 are open and the DOMAIN DNS record points to this VPS."
