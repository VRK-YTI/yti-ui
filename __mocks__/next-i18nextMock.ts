const useTranslation = () => ({
  // return tr-translation-key instead of the actual translated value
  t: (str: string) => 'tr-' + str,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
    language: 'fi',
  },
});

export { useTranslation };
