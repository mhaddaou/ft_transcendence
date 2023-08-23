#!/bin/sh

npm run prisma:generate
npm run prisma:migrate:deploy
npx prisma db push
npm run start:dev
