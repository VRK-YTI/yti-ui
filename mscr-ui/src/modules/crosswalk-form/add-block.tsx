import InlineListBlock from '@app/common/components/inline-list-block';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import { useTranslation } from 'next-i18next';
import { Button, Label } from 'suomifi-ui-components';
import { AddBlockWrapper } from './crosswalk-form.styles';

export default function AddBlock({
  data,
  locale,
}: {
  data: CrosswalkFormType;
  locale: string;
}) {
  const { t } = useTranslation('admin');
  // Need to check if we can add file in the same form?
  return (
    <AddBlockWrapper>
      <InlineListBlock
        label={t('terminologies-in-use')}
        optionalText={t('optional')}
        labelRow={true}
        addNewComponent={<UpdateWithFileModal pid={''} />}
        items={data.languages.map((t) => ({
          id: t.labelText,
          label: t.description,
        }))}
        handleRemoval={function (id: string): void {
          throw new Error('Function not implemented.');
        }}
      ></InlineListBlock>

      <Label htmlFor="codes" optionalText={t('optional')}>
        {t('reference-data-in-use')}
      </Label>
      <Button variant="secondary" icon="plus" id="codes" disabled>
        {t('add-reference-data')}
      </Button>

      <Label htmlFor="data-models" optionalText={t('optional')}>
        {t('data-models-in-use')}
      </Label>
      <Button variant="secondary" icon="plus" id="data-models" disabled>
        {t('add-data-model')}
      </Button>

      <Label htmlFor="links" optionalText={t('optional')}>
        {t('links')}
      </Label>
      <Button variant="secondary" icon="plus" id="links" disabled>
        {t('add-new-link')}
      </Button>
    </AddBlockWrapper>
  );
}
