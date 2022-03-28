import { useEffect, useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import LanguageBlock from './language-block';
import { MultiselectSmBot } from './new-terminology.styles';

export interface TerminologyName {
  lang: string;
  name: string;
  description: string;
}

export default function LanguageSelector({ update }: any) {
  const { isSmall } = useBreakpoints();
  const [selectedLanguages, setSelectedLanguages] = useState<MultiSelectData[]>(
    []
  );
  const [terminologyNames, setTerminologyNames] = useState<TerminologyName[]>(
    []
  );

  const languages = [
    {
      name: 'Suomi',
      labelText: 'suomi FI',
      uniqueItemId: 'fi',
    },
    {
      name: 'Englanti',
      labelText: 'englanti EN',
      uniqueItemId: 'en',
    },
    {
      name: 'Ruotsi',
      labelText: 'ruotsi SV',
      uniqueItemId: 'sv',
    },
  ];

  useEffect(() => {
    update('description', [
      terminologyNames,
      !terminologyNames.find((t) => !t.name),
    ]);
  }, [terminologyNames]);

  const handleSelectedLanguagesChange = (e: MultiSelectData[]) => {
    setSelectedLanguages(e);
    setTerminologyNames(
      terminologyNames.filter((tn) => {
        const languages: string[] = e.map((sl) => sl.uniqueItemId);

        if (languages.includes(tn.lang)) {
          return true;
        }
      })
    );
  };

  return (
    <>
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">Sanaston kielet</Text>
      </Paragraph>

      <Paragraph marginBottomSpacing="m">
        <Text>
          Valitse sanastolle kielet, joilla sanaston sisältö on kuvattu. Anna
          myös sanaston nimi ja kuvaus valituilla kielillä.
        </Text>
      </Paragraph>

      <MultiselectSmBot
        labelText="Sanaston kielet"
        items={languages}
        chipListVisible={true}
        ariaChipActionLabel="Remove"
        ariaSelectedAmountText="languages selected"
        ariaOptionsAvailableText="options available"
        ariaOptionChipRemovedText="removed"
        noItemsText="no items"
        visualPlaceholder="Valitse sanaston kielet"
        onItemSelectionsChange={(e) => handleSelectedLanguagesChange(e)}
        isSmall={isSmall}
      />

      {selectedLanguages.map((language, idx) => (
        <LanguageBlock
          lang={language}
          isSmall={isSmall}
          terminologyNames={terminologyNames}
          setTerminologyNames={setTerminologyNames}
          key={`${language}-${idx}`}
        />
      ))}
    </>
  );
}
