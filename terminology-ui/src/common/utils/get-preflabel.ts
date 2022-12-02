interface getPrefLabelProps {
  prefLabels: { [value: string]: string };
  lang: string;
}

export default function getPrefLabel({ prefLabels, lang }: getPrefLabelProps) {
  if (!prefLabels) {
    return '';
  }

  if (prefLabels[lang]) {
    return prefLabels[lang];
  }

  if (prefLabels['fi']) {
    return prefLabels['fi'] + ' (fi)';
  }

  if (Object.keys(prefLabels).length > 0) {
    return (
      prefLabels[Object.keys(prefLabels)[0]] +
      ` (${Object.keys(prefLabels)[0]})`
    );
  }

  return '';
}
