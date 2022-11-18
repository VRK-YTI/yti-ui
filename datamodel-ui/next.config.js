const { i18n } = require('./next-i18next.config');
const withTM = require('next-transpile-modules')(['../common-ui']);

let config = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  i18n,
};

if (process.env.REWRITE_PROFILE === 'local') {
  // if run locally in a development environment, the API may run either as a
  // container or as a process, but will always listen on the same port
  console.log('applying rewrites with local profile');
  config = {
    ...config,
    // https://nextjs.org/docs/api-reference/next.config.js/rewrites
    async rewrites() {
      return [
        {
          source: '/datamodel-api/:path*',
          destination: 'http://localhost:9004/datamodel-api/:path*',
        },
      ];
    },
  };
} else {
  // When running in a container, we should forward the api calls to
  // other containers. In k8s, this only affects calls from SSR.
  console.log('applying rewrites with docker profile');
  config = {
    ...config,
    // https://nextjs.org/docs/api-reference/next.config.js/rewrites
    async rewrites() {
      return [
        {
          source: '/datamodel-api/:path*',
          destination: 'http://yti-datamodel-api:9004/datamodel-api/:path*',
        },
      ];
    },
  };
  config = {
    ...config,
    env: {
      DATAMODEL_API_URL: process.env.DATAMODEL_API_URL,
      SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    }
  };
}

const nextConfig = withTM(config);

module.exports = nextConfig;
