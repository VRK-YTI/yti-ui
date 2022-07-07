import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { AlertsWrapper, AlertToast } from './alert-toast.styles';
import { Alert, selectAlert, setAlertVisibility } from './alert.slice';
import NotificationToast from './notification-toast';

interface AlertToastProps {
  alert: Alert;
  alerts: Alert[];
  type: 'neutral' | 'warning' | 'error';
}

export function Alerts() {
  const { isSmall } = useBreakpoints();
  const alerts = useSelector(selectAlert());

  if (!alerts) {
    return null;
  }

  return (
    <AlertsWrapper
      $scrollY={typeof window !== 'undefined' ? window.scrollY : 0}
      $isSmall={isSmall}
    >
      {alerts.map((alert, idx) => {
        if (!alert.visible) {
          return;
        }

        if (alert.code === 0) {
          return <NotificationToast key={`alert-${idx}`} alert={alert} />;
        } else {
          return (
            <AlertToastComponent
              key={`alert-${idx}`}
              alert={alert}
              alerts={alerts}
              type={'error'}
            />
          );
        }
      })}
    </AlertsWrapper>
  );
}

export function AlertToastComponent({ alert, alerts, type }: AlertToastProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('alert');
  const [show, setShow] = useState(true);
  const dispatch = useStoreDispatch();
  const alertsLength = alerts.filter((a) => a.visible).length;

  if (!show) {
    return null;
  }

  const handleClick = () => {
    setShow(false);
    const newAlerts = alerts.map((newAlert) =>
      newAlert === alert ?
        { ...newAlert, visible: false } :
        newAlert
    );

    dispatch(setAlertVisibility(newAlerts));
  };

  return (
    <AlertToast
      status={type}
      closeText={t('toast-close')}
      onCloseButtonClick={() => handleClick()}
      smallScreen={isSmall}
      $isSmall={isSmall}
    >
      {alertsLength > 1 && `(${alertsLength})`}{' '}
      {t('error-occured', { id: alert.code ?? '' })}
    </AlertToast>
  );
}
