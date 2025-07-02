#!/bin/bash

: "${PUZZLE_SECRET:?PUZZLE_SECRET environment variable not set -- contact admins if this is the official deployment}"

cd /tmp
printf "user ID: "
read -r USER_ID
flag_inner="$(printf '%s_%s' "$USER_ID" "$PUZZLE_SECRET" | sha256sum - | awk '{print $1}')"
printf 'hack{%s}\n' "$flag_inner" > ./flag

exec /app/lemonade_stand 2>&1