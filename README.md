# yti-terminology-ui

A user interface for the terminology editor

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installing node.js

This app needs Node.js v16. You need to install it before you can continue.

If you are using Linux, you can use [nvm](https://github.com/nvm-sh/nvm) which
makes it easy to install Node and switch between versions in the future. Follow
its installing instructions and then install Node.js by running
`nvm install 16`.

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

You can find more documentation in [docs](./docs).
