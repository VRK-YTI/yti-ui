#!/bin/bash

docker build \
  -t yti-datamodel-ui \
  -f "Dockerfile" \
  --build-arg REWRITE_PROFILE=${REWRITE_PROFILE:=docker} \
  --build-arg SKIP_TESTS=${SKIP_TESTS:=} \
  --build-arg SKIP_COVERAGE=${SKIP_COVERAGE:=} \
  ..
