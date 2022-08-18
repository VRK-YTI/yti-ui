import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
  WiderTextarea,
} from './concept-basic-information.styles';
import ListBlock from '../list-block';
import { ListType } from '../new-concept.types';
import { BasicInfoUpdate } from './concept-basic-information';
import { TEXT_AREA_MAX } from '@app/common/utils/constants';

interface OrganizationalInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
  initialValues?: {
    changeHistory: string;
    editorialNote: ListType[];
    etymology: string;
  };
}

export default function OrganizationalInformation({
  infoKey,
  update,
  initialValues,
}: OrganizationalInformationProps) {
  const { t } = useTranslation('admin');
  const [changeHistory, setChangeHistory] = useState<string>(
    initialValues?.changeHistory ?? ''
  );
  const [etymology, setEtymology] = useState<string>(
    initialValues?.etymology ?? ''
  );
  const [editorialNotes, setEditorialNotes] = useState<ListType[]>(
    initialValues?.editorialNote ?? []
  );

  const handleOrgInfo = ({ key, lang, value }: BasicInfoUpdate) => {
    if (Array.isArray(value)) {
      setEditorialNotes(value ?? []);
      handleChange(true, value);
    }
  };

  const handleChange = (useValue?: boolean, value?: ListType[] | null) => {
    update({
      key: infoKey,
      value: {
        changeHistory: changeHistory.trim(),
        etymology: etymology.trim(),
        editorialNote: useValue ? value : editorialNotes,
      },
    });
  };

  return (
    <ConceptExpander id="organization-information-expander">
      <ExpanderTitleButton asHeading="h3">
        {t('organizational-information')}
      </ExpanderTitleButton>

      <ExpanderContentFitted>
        <WiderTextarea
          labelText={t('change-history')}
          optionalText={t('optional')}
          hintText={t('change-history-hint')}
          visualPlaceholder={t('change-history-placeholder')}
          $smMarginTop={'true'}
          onBlur={() => handleChange()}
          onChange={(e) => setChangeHistory(e.target.value)}
          value={changeHistory}
          maxLength={TEXT_AREA_MAX}
          id="change-history-input"
        />

        <WiderTextarea
          labelText={t('etymology')}
          optionalText={t('optional')}
          hintText={t('etymology-hint')}
          visualPlaceholder={t('etymology-placeholder')}
          $smMarginTop={'true'}
          onBlur={() => handleChange()}
          onChange={(e) => setEtymology(e.target.value)}
          value={etymology}
          maxLength={TEXT_AREA_MAX}
          id="etymology-input"
        />

        <ListBlock
          items={editorialNotes}
          update={handleOrgInfo}
          itemsKey={'editorialNote'}
          noLangOption
          title={t('editorialNote')}
          description={t('editorialNote-description')}
          addNewText={t('add-new-editorialNote')}
          inputLabel={t('editorialNote-textarea-label-text')}
          inputPlaceholder={t('editorialNote-textarea-placeholder')}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
