import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { Alert, selectAlert, setAlert } from './alert.slice';
import { Toast, ToastIcon } from './alert-toast.styles';

interface NotificationToastProps {
  alert: Alert;
}

export default function NotificationToast({ alert }: NotificationToastProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('alert');
  const dispatch = useStoreDispatch();
  const previousAlerts = useSelector(selectAlert());

  useEffect(() => {
    const wait = setTimeout(() => {
      dispatch(
        setAlert(
          previousAlerts
            .filter((a) => a.code !== 0)
            .map((a) => ({ status: a.code as number, data: a.message })),
          []
        )
      );
    }, 5000);

    return () => clearTimeout(wait);
  }, [dispatch, previousAlerts]);

  return (
    <Toast role="alert" $isSmall={isSmall}>
      <ToastIcon icon="checkCircle" />
      {t(alert.message)}
    </Toast>
  );
}
