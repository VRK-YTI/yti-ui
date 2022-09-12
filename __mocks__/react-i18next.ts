const useTranslation = () => ({
  // return tr-translation-key instead of the actual translated value
  t: (str: string) => 'tr-' + str,
  i18n: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    changeLanguage: () => new Promise(() => {}),
    language: 'fi',
  },
});

export { useTranslation };
