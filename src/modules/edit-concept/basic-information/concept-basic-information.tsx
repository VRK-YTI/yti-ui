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
import { ExpanderGroup } from 'suomifi-ui-components';
import { BasicInfo, ListType } from '../new-concept.types';
import ListBlock from '../list-block';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';

interface ConceptBasicInformationProps {
  updateBasicInformation: (value: BasicInfo) => void;
  initialValues: BasicInfo;
  languages: string[];
}

export interface BasicInfoUpdate {
  key: string;
  lang?: string;
  value: string | object | ListType[];
}

export default function ConceptBasicInformation({
  updateBasicInformation,
  initialValues,
  languages,
}: ConceptBasicInformationProps) {
  const { t } = useTranslation('admin');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialValues);

  const handleBasicInfoUpdate = ({ key, lang, value }: BasicInfoUpdate) => {
    if (key === 'definition' && lang && typeof value === 'string') {
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

      <ListBlock
        items={basicInfo.example}
        itemsKey="example"
        update={handleBasicInfoUpdate}
        languages={languages}
        title={t('example')}
        description={t('example-description')}
        addNewText={t('add-new-example')}
        inputLabel={t('example-textarea-label-text')}
        inputPlaceholder={t('example-textarea-placeholder')}
      />

      {renderSubject()}

      <ListBlock
        items={basicInfo.note}
        itemsKey="note"
        update={handleBasicInfoUpdate}
        languages={languages}
        title={t('note')}
        description={t('note-description')}
        addNewText={t('add-new-note')}
        inputLabel={t('note-textarea-label-text')}
        inputPlaceholder={t('note-textarea-placeholder')}
      />

      <ExpanderGroup closeAllText="" openAllText="">
        <ConceptDiagramsAndSources
          infoKey="diagramAndSource"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.diagramAndSource}
        />
        <OrganizationInformation
          infoKey="orgInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.orgInfo}
        />
        <OtherInformation
          infoKey="otherInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.otherInfo}
        />
        <RelationalInformation
          infoKey="relationalInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.relationalInfo}
        />
      </ExpanderGroup>
    </>
  );

  function renderDefinitions() {
    return (
      <>
        {languages.map((language, idx) => {
          return renderDefinitionTextarea(language, idx);
        })}
      </>
    );
  }

  function renderDefinitionTextarea(lang: string, idx: number) {
    return (
      <WiderTextarea
        key={`definition-text-area-${idx}`}
        labelText={t('definition-label-text', {
          lang: translateLanguage(lang, t),
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
        maxLength={TEXT_AREA_MAX}
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
        maxLength={TEXT_INPUT_MAX}
      />
    );
  }
}
