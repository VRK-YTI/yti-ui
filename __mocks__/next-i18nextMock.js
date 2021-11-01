
const mockTranslations = {
  'site-login': 'Kirjaudu',
  'site-logout': 'Kirjaudu ulos'
};

const useMock = [k => k, {}];
useMock.t = k => mockTranslations[k] ?? k;

module.exports = {
  useTranslation: () => useMock,
};
