import InlineListBlock from '@app/common/components/inline-list-block';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { ModelTerminology } from '@app/common/interfaces/model.interface';
import { useTranslation } from 'next-i18next';
import { Button, Label } from 'suomifi-ui-components';
import { AddBlockWrapper } from './model-form.styles';

export default function AddBlock({
  data,
  locale,
  setTerminologies,
}: {
  data: ModelFormType;
  locale: string;
  setTerminologies: (t: ModelTerminology[]) => void;
}) {
  const { t } = useTranslation('admin');

  return (
    <AddBlockWrapper>
      <InlineListBlock
        label={t('terminologies-in-use')}
        optionalText={t('optional')}
        labelRow={true}
        addNewComponent={<UpdateWithFileModal />}
        items={data.terminologies.map((t) => ({
          id: t.uri,
          label: t.label[locale],
        }))}
        handleRemoval={(item) =>
          setTerminologies(data.terminologies.filter((t) => t.uri !== item))
        }
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
