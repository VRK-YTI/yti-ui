interface getPrefLabelProps {
  prefLabels: { [value: string]: string };
  lang: string;
}

export default function getPrefLabel({ prefLabels, lang }: getPrefLabelProps) {
  if (!prefLabels) {
    return 'null';
  }
  return (
    prefLabels[lang] ??
    prefLabels['fi'] + ' (fi)' ??
    prefLabels[Object.keys(prefLabels)[0]] + ` (${Object.keys(prefLabels)[0]})`
  );
}
