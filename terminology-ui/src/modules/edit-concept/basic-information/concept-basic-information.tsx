import Separator from 'yti-common-ui/separator';
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
import { FormError } from '../validate-form';
import StatusPicker from './status-picker';

interface ConceptBasicInformationProps {
  updateBasicInformation: (value: BasicInfo) => void;
  initialValues: BasicInfo;
  languages: string[];
  errors: FormError;
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
  errors,
}: ConceptBasicInformationProps) {
  const { t } = useTranslation('admin');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialValues);

  const handleBasicInfoUpdate = ({ key, lang, value }: BasicInfoUpdate) => {
    if (key === 'definition' && lang && typeof value === 'string') {
      const newBasicInfo = {
        ...basicInfo,
        ['definition']: { ...basicInfo['definition'], [lang]: value.trim() },
      };
      setBasicInfo(newBasicInfo);
      updateBasicInformation(newBasicInfo);
    } else {
      const newBasicInfo = {
        ...basicInfo,
        [key]: typeof value === 'string' ? value.trim() : value,
      };
      setBasicInfo(newBasicInfo);
      updateBasicInformation(newBasicInfo);
    }
  };

  return (
    <>
      <Separator isLarge />
      <H2Sm variant="h2">{t('concept-basic-information')}</H2Sm>

      {renderDefinitions()}
      {renderSubject()}

      <ListBlock
        items={basicInfo.note}
        itemsKey="note"
        update={handleBasicInfoUpdate}
        languages={languages}
        title={t('note')}
        addNewText={t('add-new-note')}
        inputLabel={t('note-textarea-label-text')}
        inputPlaceholder={t('note-textarea-placeholder')}
        errors={errors}
      />

      <ListBlock
        items={basicInfo.example}
        itemsKey="example"
        update={handleBasicInfoUpdate}
        languages={languages}
        title={t('example')}
        addNewText={t('add-new-example')}
        inputLabel={t('example-textarea-label-text')}
        inputPlaceholder={t('example-textarea-placeholder')}
        errors={errors}
      />

      <StatusPicker
        initialValue={basicInfo.status}
        update={handleBasicInfoUpdate}
        errors={errors}
      />

      <ExpanderGroup closeAllText="" openAllText="">
        <RelationalInformation
          infoKey="relationalInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.relationalInfo}
        />
        <ConceptDiagramsAndSources
          infoKey="diagramAndSource"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.diagramAndSource}
          errors={errors}
        />
        <OrganizationInformation
          infoKey="orgInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.orgInfo}
          errors={errors}
        />
        <OtherInformation
          infoKey="otherInfo"
          update={handleBasicInfoUpdate}
          initialValues={basicInfo.otherInfo}
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
        className="definition-input"
      />
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText={t('subject')}
        visualPlaceholder={t('subject-visual-placeholder')}
        optionalText={t('optional')}
        onBlur={(e) =>
          handleBasicInfoUpdate({
            key: 'subject',
            value: e.target.value,
          })
        }
        defaultValue={basicInfo.subject}
        maxLength={TEXT_INPUT_MAX}
        id="subject-input"
      />
    );
  }
}
