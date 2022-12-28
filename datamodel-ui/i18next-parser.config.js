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
  defaultNamespace: 'common',
};
