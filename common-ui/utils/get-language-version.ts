interface getLanguageVersionProps {
  data?: { [key: string]: string };
  lang?: string;
  appendLocale?: boolean;
}

export function getLanguageVersion({
  data,
  lang = 'fi',
  appendLocale = false,
}: getLanguageVersionProps) {
  if (!data) {
    return '';
  }

  if (data[lang]) {
    return data[lang];
  }

  if (data.fi) {
    return appendLocale ? `${data.fi} (fi)` : data.fi;
  } else if (data.en) {
    return appendLocale ? `${data.en} (en)` : data.en;
  }

  if (Object.keys(data).length > 0) {
    const localeKey = Object.keys(data)[0];
    return appendLocale ? `${data[localeKey]} (${localeKey})` : data[localeKey];
  }

  return '';
}
