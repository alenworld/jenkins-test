#!/bin/bash
set -e

### PRODUCTION ENV ###

if [ "${NODE_ENV}" == "production" ]; then
echo "Migration started"
npm run migration

echo "Start prod"
npm run start
fi

### DEVELOPMENT ENV ###

if [ "${NODE_ENV}" == "development" ]; then
echo "Migration started"
npm run migration

echo "Start develpment"
npm run start:dev
fi

### TESTS ENV ###

if [ "${NODE_ENV}" == "testing" ]; then
echo "Migration started"
npm run migration

npm run test:e2e

fi

### STAGING ENV ###
if [ "${NODE_ENV}" == "staging" ]; then
echo "Migration started"
npm run migration

echo "Start staging"
npm run start
fi

exec "$@"
