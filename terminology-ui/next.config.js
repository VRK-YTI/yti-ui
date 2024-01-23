const { i18n } = require('./next-i18next.config');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const fs = require('fs');
const withTM = require('next-transpile-modules')(['../common-ui']);

module.exports = (phase, { defaultConfig }) => {
  let versionInfo;

  if (fs.existsSync('public/version.txt')) {
    versionInfo = fs.readFileSync('public/version.txt', 'utf8');
  } else {
    versionInfo = 'dev-local';
  }

  let config = {
    basePath: '/vocabularies',
    experimental: {
      scrollRestoration: true,
    },
    compiler: {
      styledComponents: true,
    },
    reactStrictMode: true,
    i18n,
    eslint: {
      dirs: ['src'],
    },
    async redirects() {
      return [
        {
          source: '/concepts/:path*',
          destination: '/terminology/:path*',
          permanent: true,
        },
      ];
    },
    publicRuntimeConfig: {
      versionInfo,
    },
    async headers() {
      const isProd = process.env.NODE_ENV === 'production';
      const matomoUrl = process.env.MATOMO_URL ?? '';

      const ProductionContentSecurityPolicy = [
        "base-uri 'self';",
        "default-src 'self';",
        "font-src 'self';",
        "img-src 'self' data:;",
        `script-src 'self' 'unsafe-inline' ${matomoUrl};`,
        `connect-src 'self' ${matomoUrl};`,
        "style-src 'self' 'unsafe-inline' data:;",
        "frame-src 'self';",
      ];

      const ContentSecurityPolicy = [
        "base-uri 'self';",
        "default-src 'self';",
        "font-src 'self';",
        "img-src 'self' 'unsafe-eval' 'unsafe-inline' data:;",
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${matomoUrl};`,
        `connect-src 'self' ${matomoUrl};`,
        "style-src 'self' 'unsafe-inline' data:;",
        "frame-src 'self';",
      ];

      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: isProd
                ? ProductionContentSecurityPolicy.join(' ')
                : ContentSecurityPolicy.join(' '),
            },
            {
              key: 'Referrer-Policy',
              value: 'same-origin',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
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
            destination: 'http://localhost:9103/terminology-api/:path*',
          },
          {
            source: '/messaging-api/:path*',
            destination: 'http://localhost:9801/messaging-api/:path*',
          },
          {
            source: '/codelist-api/:path*',
            destination: 'http://localhost:9601/codelist-api/:path*',
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
            source: '/terminology-api/:path*',
            destination:
              'http://yti-terminology-api:9103/terminology-api/:path*',
          },
          {
            source: '/messaging-api/:path*',
            destination: 'http://yti-messaging-api:9801/messaging-api/:path*',
          },
          {
            source: '/codelist-api/:path*',
            destination:
              'http://yti-codelist-public-api-service:9601/codelist-api/:path*',
          },
        ];
      },
    };
  }

  return withTM(config);
};
