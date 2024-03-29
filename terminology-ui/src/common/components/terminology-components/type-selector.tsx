import { useTranslation } from 'next-i18next';
import { RadioButton } from 'suomifi-ui-components';
import {
  BlankFieldset,
  RadioButtonGroupSmBot,
} from './terminology-components.styles';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';

export interface TypeSelectorProps {
  update: ({ key, data }: UpdateTerminology) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export default function TypeSelector({
  update,
  defaultValue,
  disabled,
}: TypeSelectorProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();

  const handleSetSelected = (value: string) => {
    update({ key: 'type', data: value });
  };

  return (
    <BlankFieldset>
      <RadioButtonGroupSmBot
        labelText={t('terminology-type')}
        name="terminology-type"
        defaultValue={defaultValue ?? 'TERMINOLOGICAL_VOCABULARY'}
        onChange={(e) => handleSetSelected(e)}
        id="terminology-type-selector"
      >
        <RadioButton
          value="TERMINOLOGICAL_VOCABULARY"
          id="type-terminological"
          variant={isSmall ? 'large' : 'small'}
          disabled={disabled}
        >
          {t('terminological-vocabulary')}
        </RadioButton>
        <RadioButton
          value="OTHER_VOCABULARY"
          id="type-other"
          variant={isSmall ? 'large' : 'small'}
          disabled={disabled}
        >
          {t('other-vocabulary')}
        </RadioButton>
      </RadioButtonGroupSmBot>
    </BlankFieldset>
  );
}
