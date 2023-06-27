const { i18n } = require('./next-i18next.config');
const withTM = require('next-transpile-modules')(['../common-ui']);

module.exports = () => {
  let config = {
    compiler: {
      styledComponents: true,
    },
    reactStrictMode: true,
    eslint: {
      dirs: ['src'],
    },
    i18n,
    async headers() {
      const isProd = process.env.NODE_ENV === 'production';

      const ProductionContentSecurityPolicy = [
        "base-uri 'self';",
        "default-src 'self';",
        "font-src 'self';",
        "img-src 'self' data:;",
        "script-src 'self' 'unsafe-inline';",
        "connect-src 'self';",
        "style-src 'self' 'unsafe-inline' data:;",
        "frame-src 'self';",
      ];

      const ContentSecurityPolicy = [
        "base-uri 'self';",
        "default-src 'self';",
        "font-src 'self';",
        "img-src 'self' 'unsafe-eval' 'unsafe-inline' data:;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "connect-src 'self';",
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
            source: '/datamodel-api/:path*',
            destination: 'http://localhost:9004/datamodel-api/:path*',
          },
          {
            source: '/terminology-api/:path*',
            destination: 'http://localhost:9103/terminology-api/:path*',
          },
          {
            source: '/codelist-api/:path*',
            destination: 'https://koodistot.suomi.fi/codelist-api/:path*',
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
          {
            source: '/terminology-api/:path*',
            destination:
              'http://yti-terminology-api:9103/terminology-api/:path*',
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
