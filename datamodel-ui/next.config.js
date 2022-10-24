const withTM = require("next-transpile-modules")(["../common-ui"]);

const nextConfig = withTM({
  reactStrictMode: true,
  eslint: {
    dirs: ["pages"],
  },
});

module.exports = nextConfig;
