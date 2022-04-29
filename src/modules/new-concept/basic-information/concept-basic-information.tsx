import Separator from '@app/common/components/separator';
import {
  WiderTextarea,
  ExpanderBlock,
  H2Sm,
  SubjectTextInput,
} from './concept-basic-information.styles';
import ConceptDiagramsAndSources from './concept-diagrams-and-sources';
import OtherInformation from './other-information';
import OrganizationInformation from './organizational-information';
import RelationalInformation from './relational-information';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import ConceptInfoBlock from './concept-info-block';
import { BasicInfoUpdate } from './concept-basic-information-interface';

interface BasicInfoType {
  definition: {
    fi?: string;
    sv?: string;
    en?: string;
  };
  example: [];
  subject: string;
  note: [];
}

export default function ConceptBasicInformation() {
  const { t } = useTranslation('admin');
  const [basicInfo, setBasicInfo] = useState<BasicInfoType>({
    definition: {},
    example: [],
    subject: '',
    note: [],
  });

  const handleBasicInfoUpdate = ({ key, lang, value }: BasicInfoUpdate) => {
    if (lang && key === 'definition') {
      setBasicInfo((basicInfo) => ({
        ...basicInfo,
        ['definition']: { ...basicInfo['definition'], [lang]: value },
      }));
    } else {
      setBasicInfo((basicInfo) => ({ ...basicInfo, [key]: value }));
    }
  };

  return (
    <>
      <Separator isLarge />

      <H2Sm variant="h2">{t('concept-basic-information')}</H2Sm>

      {renderDefinitions()}

      <ConceptInfoBlock infoKey="example" update={handleBasicInfoUpdate} />

      {renderSubject()}

      <ConceptInfoBlock infoKey="note" update={handleBasicInfoUpdate} />

      <ExpanderBlock>
        <ConceptDiagramsAndSources />
        <OrganizationInformation />
        <OtherInformation />
        <RelationalInformation />
      </ExpanderBlock>
    </>
  );

  function renderDefinitions() {
    return (
      <>
        {renderDefinitionTextarea('fi')}
        {renderDefinitionTextarea('sv')}
        {renderDefinitionTextarea('en')}
      </>
    );
  }

  function renderDefinitionTextarea(lang: string) {
    return (
      <WiderTextarea
        labelText={t('definition-label-text', {
          lang: lang,
          langUpper: lang.toUpperCase(),
        })}
        optionalText={t('optional')}
        visualPlaceholder={t('give-definition')}
        onChange={(e) =>
          handleBasicInfoUpdate({
            key: 'definition',
            lang: lang,
            value: e.target.value,
          })
        }
        value={
          basicInfo.definition[lang as keyof BasicInfoType['definition']] ?? ''
        }
      />
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText={t('subject')}
        hintText={t('subject-hint-text')}
        visualPlaceholder={t('subject-visual-placeholder')}
        onChange={(e) =>
          handleBasicInfoUpdate({ key: 'subject', value: e as string })
        }
        value={basicInfo.subject}
      />
    );
  }
}
