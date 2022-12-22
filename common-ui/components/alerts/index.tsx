import { useTranslation } from 'next-i18next';
import { Notification } from 'suomifi-ui-components';
import { AlertsWrapper } from './alert.styles';
import { useEffect, useState } from 'react';
import { useBreakpoints } from '../media-query';
import { Alert } from '../../interfaces/alert';

interface AlertsProps {
  alerts: Alert[];
  setAlertVisibility: (alerts: Alert[], displayText: string) => void;
}

export default function Alerts({ alerts, setAlertVisibility }: AlertsProps) {
  const { t } = useTranslation('alert');
  const [scrollPos, setScrollPos] = useState(0);
  const { isSmall } = useBreakpoints();

  const handleSetVisible = (displayText: string) => {
    setAlertVisibility(alerts, displayText);
  };

  const handleScroll = () => {
    setScrollPos(window.scrollY);
  };

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <AlertsWrapper $scrollPos={scrollPos} $fromTop={isSmall ? 62 : 128}>
      {alerts
        .filter((alert) => alert.visible)
        .map((alert, idx) => {
          if (idx === 0) {
            const alertsLength = alerts.filter((a) => a.visible).length;
            const isError = alert.code !== 0 ? true : false;
            const displayText =
              alert.displayText === '' ? t('error-occured') : alert.displayText;

            return (
              <Notification
                key={`alert-${idx}`}
                closeText=""
                status={isError ? 'error' : 'neutral'}
                onCloseButtonClick={() => handleSetVisible(alert.displayText)}
              >
                {isError ? (
                  <>
                    {alertsLength > 1 ? `(${alertsLength}) ` : ''}
                    {t('error-alert', {
                      id: alert.code ?? '',
                      displayText,
                    })}
                  </>
                ) : (
                  <>{displayText}</>
                )}
              </Notification>
            );
          }

          return null;
        })}
    </AlertsWrapper>
  );
}
