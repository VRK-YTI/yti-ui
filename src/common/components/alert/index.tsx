import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { selectAlert, setAlertVisibility } from './alert.slice';
import { useTranslation } from 'next-i18next';
import { Notification } from 'suomifi-ui-components';
import { AlertsWrapper } from './alert.styles';
import { useEffect, useState } from 'react';
import { useBreakpoints } from '../media-query/media-query-context';

export default function Alerts() {
  const { t } = useTranslation('alert');
  const [scrollPos, setScrollPos] = useState(0);
  const dispatch = useStoreDispatch();
  const alerts = useSelector(selectAlert());
  const { isSmall } = useBreakpoints();

  const handleSetVisible = (displayText: string) => {
    dispatch(setAlertVisibility(alerts, displayText));
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
                    {t(`error-occured${alert.displayText}`, {
                      id: alert.code ?? '',
                    })}
                  </>
                ) : (
                  <>{t(alert.displayText)}</>
                )}
              </Notification>
            );
          }

          return null;
        })}
    </AlertsWrapper>
  );
}
