const isBrowser = typeof window !== 'undefined';

module.exports = {
  i18n: {
    defaultLocale: 'fi',
    locales: ['fi', 'en', 'sv'],
    localeDetection: false,
  },
  partialBundledLanguages: isBrowser && true,
};
