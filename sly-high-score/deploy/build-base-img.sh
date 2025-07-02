#!/usr/bin/env bash

git clone https://github.com/spencerpogo/jail.git --branch dev-fd --depth 1 --recurse-submodules
cd jail
git submodule update --depth 1 --init --recursive
docker build . -t pwnred-jail-custom --load
