import { useTranslation } from 'next-i18next';
import { Button, Label } from 'suomifi-ui-components';
import { AddBlockWrapper } from './model-form.styles';

export default function AddBlock() {
  const { t } = useTranslation('admin');

  return (
    <AddBlockWrapper>
      <Label htmlFor="terminologies" optionalText={t('optional')}>
        Käytetyt sanastot
      </Label>
      <Button variant="secondary" icon="plus" id="terminologies" disabled>
        Lisää sanasto
      </Button>

      <Label htmlFor="codes" optionalText={t('optional')}>
        Käytetyt koodistot
      </Label>
      <Button variant="secondary" icon="plus" id="codes" disabled>
        Lisää koodisto
      </Button>

      <Label htmlFor="data-models" optionalText={t('optional')}>
        Käytetyt tietomallit
      </Label>
      <Button variant="secondary" icon="plus" id="data-models" disabled>
        Lisää tietomalli
      </Button>

      <Label htmlFor="links" optionalText={t('optional')}>
        Linkit
      </Label>
      <Button variant="secondary" icon="plus" id="links" disabled>
        Lisää uusi linkki
      </Button>
    </AddBlockWrapper>
  );
}
