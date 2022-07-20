import Separator from '@app/common/components/separator';
import {
  WiderTextarea,
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
import {
  BasicInfoType,
  BasicInfoUpdate,
} from './concept-basic-information-types';
import { ExpanderGroup } from 'suomifi-ui-components';

interface ConceptBasicInformationProps {
  updateBasicInformation: (value: BasicInfoType) => void;
  initialValues: BasicInfoType;
  languages: {
    lang: string;
    value: string;
    regex: string;
  }[];
}

export default function ConceptBasicInformation({
  updateBasicInformation,
  initialValues,
  languages,
}: ConceptBasicInformationProps) {
  const { t } = useTranslation('admin');
  const [basicInfo, setBasicInfo] = useState<BasicInfoType>(initialValues);

  const handleBasicInfoUpdate = ({ key, lang, value }: BasicInfoUpdate) => {
    if (lang && key === 'definition' && typeof value === 'string') {
      const newBasicInfo = {
        ...basicInfo,
        ['definition']: { ...basicInfo['definition'], [lang]: value },
      };
      setBasicInfo(newBasicInfo);
      updateBasicInformation(newBasicInfo);
    } else {
      const newBasicInfo = { ...basicInfo, [key]: value };
      setBasicInfo(newBasicInfo);
      updateBasicInformation(newBasicInfo);
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

      <ExpanderGroup closeAllText="" openAllText="">
        <ConceptDiagramsAndSources
          infoKey="diagramAndSource"
          update={handleBasicInfoUpdate}
        />
        <OrganizationInformation
          infoKey="orgInfo"
          update={handleBasicInfoUpdate}
        />
        <OtherInformation infoKey="otherInfo" update={handleBasicInfoUpdate} />
        <RelationalInformation
          infoKey="relationalInfo"
          update={handleBasicInfoUpdate}
        />
      </ExpanderGroup>
    </>
  );

  function renderDefinitions() {
    return (
      <>
        {languages.map((language) => {
          return renderDefinitionTextarea(language.lang);
        })}
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
        onBlur={(e) =>
          handleBasicInfoUpdate({
            key: 'definition',
            lang: lang,
            value: e.target.value,
          })
        }
        defaultValue={basicInfo.definition[lang] ?? ''}
      />
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText={t('subject')}
        hintText={t('subject-hint-text')}
        visualPlaceholder={t('subject-visual-placeholder')}
        onBlur={(e) =>
          handleBasicInfoUpdate({
            key: 'subject',
            value: e.target.value,
          })
        }
        defaultValue={basicInfo.subject}
      />
    );
  }
}
