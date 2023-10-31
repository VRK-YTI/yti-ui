import { useTranslation } from 'next-i18next';
import { Block, Label, ToggleInput } from 'suomifi-ui-components';

const PropertyToggle = ({
  value,
  handleUpdate,
  optionalText,
  id,
  label,
}: {
  value?: boolean;
  handleUpdate: (value: boolean) => void;
  optionalText?: string;
  id: string;
  label: string;
}) => {
  const { t } = useTranslation('common');
  return (
    <Block>
      <Label optionalText={optionalText} htmlFor={id}>
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
