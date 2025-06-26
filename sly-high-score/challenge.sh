#!/usr/bin/env -iS bash

high_score_run3=10000
high_score_papas_freezeria=20000
high_score_suika=30000
high_score_moto_x3m=40000
high_score_fireboy_watergirl=40000

read GAME < <(head -n 1 | tr -cd 'a-zA-Z0-9')
read SCORE < <(head -n 1)
declare -n PTR="$GAME"
PTR="$SCORE"