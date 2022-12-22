import { SerializedError } from '@reduxjs/toolkit';
import { AxiosBaseQueryError } from '../../interfaces/axios-base-query.interface';
import { useTranslation } from 'next-i18next';
import { Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query';
import {
  LoadWrapper,
  RefetchButton,
  LoadingIndicator,
} from './load-indicator.styles';

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
