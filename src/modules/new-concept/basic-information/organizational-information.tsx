import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, ExpanderTitleButton } from 'suomifi-ui-components';
import { BasicInfoUpdate } from './concept-basic-information-interface';
import {
  ConceptExpander,
  ExpanderContentFitted,
  WiderTextarea,
} from './concept-basic-information.styles';

interface OrganizationalInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
}

export default function OrganizationalInformation({
  infoKey,
  update,
}: OrganizationalInformationProps) {
  const { t } = useTranslation('admin');
  const [changeHistory, setChangeHistory] = useState('');
  const [etymology, setEtymology] = useState('');

  const handleChange = () => {
    update({
      key: infoKey,
      value: {
        changeHistory: changeHistory,
        etymology: etymology,
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
          smmargintop={'true'}
          onBlur={() => handleChange()}
          onChange={(e) => setChangeHistory(e.target.value)}
          value={changeHistory}
        />

        <WiderTextarea
          labelText={t('etymology')}
          optionalText={t('optional')}
          hintText={t('etymology-hint')}
          visualPlaceholder={t('etymology-placeholder')}
          smmargintop={'true'}
          onBlur={() => handleChange()}
          onChange={(e) => setEtymology(e.target.value)}
          value={etymology}
        />

        <BasicBlock
          title={t('admin-note')}
          extra={
            <BasicBlockExtraWrapper>
              <Button variant="secondary">{t('add-new-admin-note')}</Button>
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-admin-note-description')}
        </BasicBlock>
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
