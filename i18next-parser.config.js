module.exports = {
  locales: ['fi', 'en', 'sv'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  sort: true,
  tsx: [
    {
      lexer: 'JsxLexer',
    },
  ],
  ts: [
    {
      lexer: 'JsxLexer',
    },
  ],
  i18nextOptions: {
    compatibilityJSON: 'v3',
  },
  defaultNamespace: 'common',
};
