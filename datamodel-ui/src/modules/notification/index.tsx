import { useEffect, useState } from 'react';
import { Toast } from 'suomifi-ui-components';
import { NotificationWrapper } from './notifications.styles';
import { useSelector } from 'react-redux';
import {
  selectNotification,
  clearNotification,
} from '@app/common/components/notifications/notifications.slice';
import { useStoreDispatch } from '@app/store';
import { translateNotification } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { NotificationKeys } from '@app/common/interfaces/notifications.interface';

export default function Notification() {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const [showToast, setShowToast] = useState(false);
  const activeNotification = useSelector(selectNotification());

  useEffect(() => {
    if (
      !showToast &&
      activeNotification &&
      Object.keys(activeNotification).length > 0
    ) {
      setShowToast(true);
    }
  }, [showToast, activeNotification]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        dispatch(clearNotification());
      }, 5000);
    }
  }, [showToast, dispatch]);

  if (!activeNotification || Object.keys(activeNotification).length < 1) {
    return <></>;
  }

  return (
    <NotificationWrapper
      onTransitionEnd={() => setShowToast(false)}
      $visible={showToast}
    >
      {showToast && (
        <Toast>
          {translateNotification(
            Object.keys(activeNotification)?.[0] as NotificationKeys,
            t
          )}
        </Toast>
      )}
    </NotificationWrapper>
  );
}
