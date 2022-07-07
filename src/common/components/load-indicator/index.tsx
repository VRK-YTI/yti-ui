import { SerializedError } from '@reduxjs/toolkit';
import { useTranslation } from 'next-i18next';
import { Text } from 'suomifi-ui-components';
import { Error } from '@app/common/interfaces/error.interface';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { LoadWrapper, RefetchButton, TestLoad } from './load-indicator.styles';

interface LoadIndicatorProps {
  isFetching: boolean;
  error?: Error | SerializedError;
  refetch: () => void;
}

export default function LoadIndicator({
  isFetching,
  error,
  refetch,
}: LoadIndicatorProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  if (isFetching) {
    return (
      <LoadWrapper>
        <TestLoad $isSmall={isSmall} />
      </LoadWrapper>
    );
  } else if (error) {
    return (
      <LoadWrapper>
        <Text>{t('error-occured')}</Text>
        <RefetchButton onClick={() => refetch()}>
          {t('try-again')}
        </RefetchButton>
      </LoadWrapper>
    );
  }

  return null;
}
