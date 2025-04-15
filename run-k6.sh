#!/usr/bin/env bash

# run-k6.sh
set -e

# Load .env if it exists
if [ -f .env ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

# Forward all arguments to k6
k6 "$@"
