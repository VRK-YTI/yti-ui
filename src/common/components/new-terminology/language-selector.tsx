import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import LanguageBlock from './language-block';
import {
  BlankFieldset,
  BlankLegend,
  MultiselectSmBot,
} from './new-terminology.styles';
import { UpdateTerminology } from './update-terminology.interface';

export interface TerminologyName {
  lang: string;
  name: string;
  description: string;
}

export interface LanguageSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  userPosted: boolean;
}

export default function LanguageSelector({
  update,
  userPosted,
}: LanguageSelectorProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [selectedLanguages, setSelectedLanguages] = useState<MultiSelectData[]>(
    []
  );
  const [terminologyNames, setTerminologyNames] = useState<TerminologyName[]>(
    []
  );

  const languages = [
    {
      name: t('languages-name-fi'),
      labelText: t('language-label-text-fi'),
      uniqueItemId: 'fi',
    },
    {
      name: t('languages-name-en'),
      labelText: t('language-label-text-en'),
      uniqueItemId: 'en',
    },
    {
      name: t('languages-name-sv'),
      labelText: t('language-label-text-sv'),
      uniqueItemId: 'sv',
    },
  ];

  const handleSelectedLanguagesChange = (e: MultiSelectData[]) => {
    setSelectedLanguages(e);

    let newTerminologyNames;

    if (e.length < selectedLanguages.length) {
      const currLanguages = e.map((item) => item.uniqueItemId);

      newTerminologyNames = terminologyNames.filter((tn) => {
        if (currLanguages.includes(tn.lang)) {
          return tn;
        }
      });
    } else {
      const newLanguage = e.filter(
        (tn) =>
          !terminologyNames.map((item) => item.lang).includes(tn.uniqueItemId)
      )[0].uniqueItemId;

      newTerminologyNames = [
        ...terminologyNames,
        {
          lang: newLanguage,
          name: '',
          description: '',
        },
      ];
    }

    setTerminologyNames(newTerminologyNames);

    update({
      key: 'description',
      data: [
        newTerminologyNames,
        !newTerminologyNames || !newTerminologyNames.find((t) => !t.name),
      ],
    });
  };

  const handleSelectedLanguageUpdate = (
    id: string,
    name: string,
    description: string
  ) => {
    const updatedTerminologyNames = terminologyNames.map((tn) => {
      if (tn.lang === id) {
        return {
          lang: id,
          name: name,
          description: description,
        };
      } else {
        return tn;
      }
    });

    setTerminologyNames(updatedTerminologyNames);
    update({
      key: 'description',
      data: [
        updatedTerminologyNames,
        !updatedTerminologyNames.find((t) => !t.name),
      ],
    });
  };

  return (
    <BlankFieldset>
      <BlankLegend>
        <Paragraph marginBottomSpacing="m">
          <Text variant="bold">{t('terminology-languages')}</Text>
        </Paragraph>

        <Paragraph marginBottomSpacing="m">
          <Text>{t('terminology-languages-description')}</Text>
        </Paragraph>
      </BlankLegend>

      <MultiselectSmBot
        labelText={t('terminology-languages')}
        items={languages}
        chipListVisible={true}
        ariaChipActionLabel={t('aria-chip-action-label')}
        ariaSelectedAmountText={t('chosen-languages')}
        ariaOptionsAvailableText={t('available-languages')}
        ariaOptionChipRemovedText={t('language-removed')}
        noItemsText={t('no-languages-available')}
        visualPlaceholder={t('languages-visual-placeholder')}
        onItemSelectionsChange={(e) => handleSelectedLanguagesChange(e)}
        issmall={isSmall ? true : undefined}
        status={
          userPosted && selectedLanguages.length === 0 ? 'error' : 'default'
        }
      />

      {selectedLanguages.map((language, idx) => (
        <LanguageBlock
          lang={language}
          isSmall={isSmall}
          handleUpdate={handleSelectedLanguageUpdate}
          userPosted={userPosted}
          id={language.uniqueItemId}
          key={`${language}-${idx}`}
        />
      ))}
    </BlankFieldset>
  );
}
