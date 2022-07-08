import { SerializedError } from '@reduxjs/toolkit';
import { useTranslation } from 'next-i18next';
import { Text } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { LoadIcon, LoadWrapper, RefetchButton } from './load-indicator.styles';
import { AxiosBaseQueryError } from '@app/store/axios-base-query';

interface LoadIndicatorProps {
  isFetching: boolean;
  error?: AxiosBaseQueryError | SerializedError;
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
        <LoadIcon icon="swapRounded" ariaLabel="Loading" isSmall={isSmall} />
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
