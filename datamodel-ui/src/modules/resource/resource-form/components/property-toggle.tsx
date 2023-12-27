import { useTranslation } from 'next-i18next';
import { Block, Label, ToggleInput, Tooltip } from 'suomifi-ui-components';

const PropertyToggle = ({
  value,
  handleUpdate,
  optionalText,
  id,
  label,
  tooltip,
}: {
  value?: boolean;
  handleUpdate: (value: boolean) => void;
  optionalText?: string;
  id: string;
  label: string;
  tooltip?: {
    text: string;
    ariaCloseButtonLabelText: string;
    ariaToggleButtonLabelText: string;
  };
}) => {
  const { t } = useTranslation('common');
  return (
    <Block>
      <Label
        optionalText={optionalText}
        htmlFor={id}
        tooltipComponent={
          tooltip && (
            <Tooltip
              ariaCloseButtonLabelText={tooltip.ariaCloseButtonLabelText}
              ariaToggleButtonLabelText={tooltip.ariaToggleButtonLabelText}
            >
              {tooltip.text}
            </Tooltip>
          )
        }
      >
        {label}
      </Label>
      <ToggleInput
        defaultChecked={value}
        onChange={(value) => handleUpdate(value)}
        id={id}
      >
        {value ? t('yes') : t('no')}
      </ToggleInput>
    </Block>
  );
};

export default PropertyToggle;
