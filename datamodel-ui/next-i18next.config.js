const isBrowser = typeof window !== 'undefined';

module.exports = {
  i18n: {
    defaultLocale: 'default',
    locales: ['default', 'fi', 'en'],
    localeDetection: false,
  },
  fallbackLng: 'fi',
  partialBundledLanguages: isBrowser && true,
};
