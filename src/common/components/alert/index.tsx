import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useBreakpoints } from '../media-query/media-query-context';
import { AlertsWrapper, AlertToast } from './alert-toast.styles';

interface AlertToastProps {
  msg: string;
  type: 'neutral' | 'warning' | 'error';
}

interface AlertsProps {
  children: React.ReactNode;
}

export function Alerts({ children }: AlertsProps) {
  const { isSmall } = useBreakpoints();

  return (
    <AlertsWrapper isSmall={isSmall}>
      {children}
    </AlertsWrapper>
  );
}

export function Alert({ msg, type }: AlertToastProps) {
  const { t } = useTranslation('alert');
  const { isSmall } = useBreakpoints();
  const [show, setShow] = useState(true);

  if (!show) {
    return null;
  }

  return (
    <AlertToast
      status={type}
      closeText={t('toast-close')}
      onCloseButtonClick={() => { setShow(false); }}
      smallScreen={isSmall}
    >
      {t(msg)}
    </AlertToast>
  );
}
