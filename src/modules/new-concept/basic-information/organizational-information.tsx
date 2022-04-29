import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { Button, ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander, ExpanderContentFitted, WiderTextarea } from './concept-basic-information.styles';

export default function OrganizationalInformation() {
  const { t } = useTranslation('admin');

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
        />

        <WiderTextarea
          labelText={t('etymology')}
          optionalText={t('optional')}
          hintText={t('etymology-hint')}
          visualPlaceholder={t('etymology-placeholder')}
          smmargintop={'true'}
        />

        <BasicBlock
          title={t('admin-note')}
          extra={
            <BasicBlockExtraWrapper>
              <Button variant='secondary'>{t('add-new-admin-note')}</Button>
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-admin-note-description')}
        </BasicBlock>

      </ExpanderContentFitted>

    </ConceptExpander>
  );
}
