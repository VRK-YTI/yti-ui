# yti-terminology-ui

A user interface for the terminology editor

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installing node.js

This app runs on Node.js. You need to install it before you can continue.

The easiest way to install Node.js is to use
[nvm](https://github.com/nvm-sh/nvm). We have defined Node.js version in
`.nvmrc` so you just need to run `nvm install` and `nvm use` to install the
correct version.

If you can't use nvm, check current Node.js version from `.nvmrc` and install it
manually.

## Getting Started

Install dependencies

```bash
npm install
```

Create file .env.local to the project root directory and add the following lines

```
TERMINOLOGY_API_URL=http://localhost:9103/terminology-api
REWRITE_PROFILE=local
SECRET_COOKIE_PASSWORD=<random string min 32 characters>
```

Run terminology-api backend application (and all its dependencies) for example
by using [yti-compose](https://github.com/VRK-YTI/yti-compose)

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `src/pages/index.tsx`. The page
auto-updates as you edit the file.

## Troubleshooting and more documentation

You can find more documentation in [docs](../docs).

Test modification 7
