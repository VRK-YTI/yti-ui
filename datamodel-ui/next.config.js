/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["../common-ui"]);

const nextConfig = withTM({
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
});

module.exports = nextConfig;
