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

interface OrganizationalInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
}

export default function OrganizationalInformation({
  infoKey,
  update,
}: OrganizationalInformationProps) {
  const { t } = useTranslation('admin');
  const [changeHistory, setChangeHistory] = useState<string>('');
  const [etymology, setEtymology] = useState<string>('');
  const [editorialNotes, setEditorialNotes] = useState<ListType[]>([]);

  const handleOrgInfo = ({ key, lang, value }: BasicInfoUpdate) => {
    if (typeof value !== 'string' && typeof value !== 'object') {
      setEditorialNotes(value ?? []);
      handleChange(true, value);
    }
  };

  const handleChange = (useValue?: boolean, value?: ListType[] | null) => {
    update({
      key: infoKey,
      value: {
        changeHistory: changeHistory,
        etymology: etymology,
        editorialNote: useValue ? value : editorialNotes,
      },
    });
  };

  return (
    <ConceptExpander>
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
        />

        <ListBlock
          items={editorialNotes}
          update={handleOrgInfo}
          itemsKey={'editorialNote'}
          noLangOption
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
