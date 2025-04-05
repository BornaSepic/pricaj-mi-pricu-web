#!/bin/bash

set -Eeuo pipefail
echo "HEEEERE"

./bin/symlink-node-modules.sh

echo 'Installing npm packages'
pnpm install

exec "$@"
