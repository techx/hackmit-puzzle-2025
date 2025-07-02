#!/usr/bin/env -iS bash

read VAR < <(head -n 1 | tr -cd 'a-zA-Z0-9')
read VAL < <(head -n 1)
declare -n PTR="$VAR"
PTR="$VAL"