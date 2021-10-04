#!/bin/bash

docker build \
  -t yti-terminology-ui \
  --build-arg REWRITE_PROFILE=${REWRITE_PROFILE:=docker} \
  .
