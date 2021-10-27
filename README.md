# yti-terminology-ui

User interface for terminology editor

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
yarn
```

Create file .env.local to the project root directory and add following lines

```
TERMINOLOGY_API_URL=http://localhost:9103/terminology-api
REWRITE_PROFILE=local
SECRET_COOKIE_PASSWORD=<random string min 32 characters>
```

Run terminology-api backend application (and all its dependencies) for example by using [yti-compose](https://github.com/VRK-YTI/yti-compose)

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
