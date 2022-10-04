import { SerializedError } from '@reduxjs/toolkit';
import { useTranslation } from 'next-i18next';
import { Text } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import {
  LoadWrapper,
  RefetchButton,
  LoadingIndicator,
} from './load-indicator.styles';
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
        <LoadingIndicator $isSmall={isSmall} id="load-indicator" />
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
