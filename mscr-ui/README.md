# yti-datamodel-ui

A user interface for the datamodel editor

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installing node.js

This app runs on Node.js. You need to install it before you can continue.

The easiest way to install Node.js is to use
[nvm](https://github.com/nvm-sh/nvm). We have defined Node.js version in
`.nvmrc` so you just need to run `nvm install` and `nvm use` to install the
correct version.

If you can't use nvm, check current Node.js version from `.nvmrc` and install it
manually.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Troubleshooting and more documentation

You can find more documentation in [docs](../docs).


curl -X 'PUT' \
  'http://localhost:9004/datamodel-api/v2/schemaFull?metadata=%7Bmetadata%3A%7B%20%20%20%22namespace%22%3A%20%22http%3A%2F%2Ftest.com%22%2C%20%22%20%20%20%20%20%22format%22%3A%20%22JSONSCHEMA%22%2C%20%20%20%22status%22%3A%20%22INCOMPLETE%22%2C%20%20%20%22label%22%3A%20%7B%20%20%20%20%20%22en%22%3A%20%22string%22%20%20%20%7D%2C%20%20%20%22description%22%3A%20%7B%20%20%20%20%20%22en%22%3A%20%22string%22%20%20%20%7D%2C%20%20%20%22languages%22%3A%20%5B%20%20%20%20%20%22en%22%20%20%20%5D%2C%20%20%20%22organizations%22%3A%20%5B%227d3a3c00-5a6b-489b-a3ed-63bb58c26a63%22%5D%20%7D%7D' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0Y2U3MDkzNy02ZmE0LTQ5YWYtYTIyOS1iNWYxMDMyOGFkYjgiLCJleHAiOjE3MTUzMzk5NjUsImlhdCI6MTY5OTYxNTE2NX0.oNDwK2Cv3C4LZ2bt8Z9F4druC58fTs_dXfbK3WSpYuW1gTK_ZplCvrBP8h6orZJbnW6fpk_I1rMuw7yFUhM2tA' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@test_json_trimmed.json;type=application/json'