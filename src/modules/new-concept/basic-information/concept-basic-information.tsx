import Separator from '@app/common/components/separator';
import {
  DefinitionTextarea,
  ExpanderBlock,
  H2Sm,
  SubjectTextInput,
} from './concept-basic-information.styles';
import ConceptDiagramsAndSources from './concept-diagrams-and-sources';
import OtherInformation from './other-information';
import OrganizationInformation from './organizational-information';
import RelationalInformation from './relational-information';
import { useTranslation } from 'next-i18next';
import { Notes } from './notes';
import Examples from './examples';
import { useState } from 'react';

interface BasicInfoUpdateProps {
  key: string;
  lang?: string;
  value: string;
}

export default function ConceptBasicInformation() {
  const { t } = useTranslation('admin');
  const [basicInfo, setBasicInfo] = useState({
    definition: {},
    example: [],
    subject: '',
    note: [],
  });

  const handleBasicInfoUpdate = ({
    key,
    lang,
    value,
  }: BasicInfoUpdateProps) => {
    if (lang) {
      setBasicInfo((basicInfo) => ({
        ...basicInfo,
        [key]: { ...basicInfo[key], [lang]: value },
      }));
    } else {
      setBasicInfo((basicInfo) => ({ ...basicInfo, [key]: value }));
    }
  };

  console.log('basicInfo', basicInfo);

  return (
    <>
      <Separator isLarge />

      <H2Sm variant="h2">{t('concept-basic-information')}</H2Sm>

      {renderDefinitions()}

      <Examples update={handleBasicInfoUpdate} />

      {renderSubject()}

      <Notes update={handleBasicInfoUpdate} />

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
      <DefinitionTextarea
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
        value={basicInfo.definition[lang] ?? ''}
      />
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText={t('subject')}
        hintText={t('subject-hint-text')}
        visualPlaceholder={t('subject-visual-placeholder')}
        onChange={(e) => handleBasicInfoUpdate({ key: 'subject', value: e })}
        value={basicInfo.subject}
      />
    );
  }
}
