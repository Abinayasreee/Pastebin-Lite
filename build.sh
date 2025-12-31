#!/bin/bash
echo "Build environment check:"
echo "UPSTASH_REDIS_REST_URL: $UPSTASH_REDIS_REST_URL"
echo "UPSTASH_REDIS_REST_TOKEN: $UPSTASH_REDIS_REST_TOKEN"
npm run build
