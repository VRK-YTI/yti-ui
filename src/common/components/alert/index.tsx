import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../../store';
import { Error } from '../../interfaces/error.interface';
import { useBreakpoints } from '../media-query/media-query-context';
import { AlertsWrapper, AlertToast } from './alert-toast.styles';
import { selectAlert, setAlert } from './alert.slice';
import NotificationToast from './notification-toast';

interface AlertToastProps {
  alert: Error;
  alerts: Error[];
  type: 'neutral' | 'warning' | 'error';
}

export function Alerts() {
  const alerts = useSelector(selectAlert());

  if (!alerts) {
    return null;
  }

  return (
    <AlertsWrapper>
      {alerts.map((alert, idx) => {
        if (alert.status === 0) {
          return <NotificationToast key={`alert-${idx}`} alert={alert} />;
        } else {
          return <Alert key={`alert-${idx}`} alert={alert} alerts={alerts} type={'error'} />;
        }
      })}
    </AlertsWrapper>
  );
}

export function Alert({ alert, alerts, type }: AlertToastProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('alert');
  const [show, setShow] = useState(true);
  const dispatch = useStoreDispatch();

  if (!show) {
    return null;
  }

  const handleClick = () => {
    setShow(false);
    const newAlerts = alerts.slice(0, alerts.length - 1);
    dispatch(setAlert(newAlerts));
  };

  return (
    <AlertToast
      status={type}
      closeText={t('toast-close')}
      onCloseButtonClick={() => handleClick()}
      smallScreen={isSmall}
      isSmall={isSmall}
    >
      {alerts.length > 1 && `(${alerts.length})`} {t('error-occured', { id: alert.status ?? ''})}
    </AlertToast>
  );
}
