import { useTranslation } from 'next-i18next';
import { RadioButton } from 'suomifi-ui-components';
import {
  BlankFieldset,
  RadioButtonGroupSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';

export interface TypeSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
}

export default function TypeSelector({ update }: TypeSelectorProps) {
  const { t } = useTranslation('admin');

  const handleSetSelected = (value: string) => {
    update({ key: 'type', data: value });
  };

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('terminology-type')}
        name="terminology-type"
        defaultValue="TERMINOLOGICAL_VOCABULARY"
        onChange={(e) => handleSetSelected(e)}
      >
        <RadioButton value="TERMINOLOGICAL_VOCABULARY">
          {t('terminological-vocabulary')}
        </RadioButton>
        <RadioButton value="OTHER_VOCABULARY">
          {t('other-vocabulary')}
        </RadioButton>
      </RadioButtonGroupSmBot>
    </BlankFieldset>
  );
}
