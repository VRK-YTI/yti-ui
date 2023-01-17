interface getLanguageVersionProps {
  data: { [key: string]: string };
  lang: string;
  appendLocale?: boolean;
}

export function getLanguageVersion({
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

interface getPropertyLanguageVersionProps {
  data?:
    | {
        '@language': string;
        '@value': string;
      }
    | {
        '@language': string;
        '@value': string;
      }[];
  lang: string;
  appendLocale?: boolean;
}

export function getPropertyLanguageVersion({
  data,
  lang,
  appendLocale,
}: getPropertyLanguageVersionProps) {
  if (!data) {
    return '';
  }

  const dataArray = !Array.isArray(data) ? [data] : data;

  if (dataArray.some((d) => d['@language'] === lang)) {
    const retObject = dataArray.find((d) => d['@language'] === lang);

    return retObject ? retObject['@value'] : '';
  }

  if (dataArray.some((d) => d['@language'] === 'fi')) {
    const retObject = dataArray.find((d) => d['@language'] === 'fi');
    const retValue = retObject ? retObject['@value'] : '';

    return appendLocale ? `${retValue} (fi)` : retValue;
  }

  if (dataArray.length > 0) {
    const localeKey = dataArray[0]['@language'];
    const retObject = dataArray.find((d) => d['@language'] === localeKey);
    const retValue = retObject ? retObject['@value'] : '';

    return appendLocale ? `${retValue} (${localeKey})` : retValue;
  }

  return '';
}
