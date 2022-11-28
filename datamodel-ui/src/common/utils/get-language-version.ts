interface getLanguageVersionProps {
  data: { [key: string]: string };
  lang: string;
  appendLocale?: boolean;
}

export default function getLanguageVersion({
  data,
  lang,
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
  }

  if (Object.keys(data).length > 0) {
    const localeKey = Object.keys(data)[0];
    return appendLocale ? `${data[localeKey]} (${localeKey})` : data[localeKey];
  }

  return '';
}
