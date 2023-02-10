import { useTranslation } from 'next-i18next';
import { Button, Label } from 'suomifi-ui-components';
import { AddBlockWrapper } from './model-form.styles';

export default function AddBlock() {
  const { t } = useTranslation('admin');

  return (
    <AddBlockWrapper>
      <Label htmlFor="terminologies" optionalText={t('optional')}>
        {t('terminologies-in-use')}
      </Label>
      <Button variant="secondary" icon="plus" id="terminologies" disabled>
        {t('add-terminology')}
      </Button>

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
