import { useTranslation } from 'react-i18next';
import { Text } from 'suomifi-ui-components';
import { RemoveIcon, RemoveWrapper } from './filter.styles';

export default function Remove() {
  const { t } = useTranslation('common');

  return (
    <RemoveWrapper>
      <RemoveIcon icon='remove'/>
      <Text
        style={{fontSize: '14px'}}
        color='highlightBase'
        variant='bold'
      >
        {t('vocabulary-filter-remove-all')}
      </Text>
    </RemoveWrapper>
  );
}
