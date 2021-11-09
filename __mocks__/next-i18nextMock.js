
const mockTranslations = {
  'site-login': 'Kirjaudu',
  'site-logout': 'Kirjaudu ulos'
};

const useMock = [k => k, {}];
useMock.t = k => mockTranslations[k] ?? k;
useMock.i18n = language => 'fi';

module.exports = {
  useTranslation: () => useMock,
};
