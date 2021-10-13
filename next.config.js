const { i18n } = require('./next-i18next.config');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  let config = {
    reactStrictMode: true,
    i18n,
    eslint: {
      dirs: ['src']
    }
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
            source: '/terminology-api/:path*',
            destination: 'http://localhost:9103/terminology-api/:path*'
          }
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
            source: '/terminology-api/:path*',
            destination: 'http://yti-terminology-api:9103/terminology-api/:path*'
          }
        ];
      },
    };
  }

  return config;
};
