import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '../../../store';
import { useBreakpoints } from '../media-query/media-query-context';
import { selectAlert, setAlert } from './alert.slice';
import { Toast, ToastIcon } from './alert-toast.styles';
import { Error } from '../../interfaces/error.interface';

interface NotificationToastProps {
  alert: Error;
}

export default function NotificationToast({ alert }: NotificationToastProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('alert');
  const dispatch = useStoreDispatch();
  const previousAlerts = useSelector(selectAlert());

  useEffect(() => {
    const wait = setTimeout(() => {
      dispatch(setAlert(previousAlerts.filter((a) => a.status !== 0)));
    }, 5000);

    return () => clearTimeout(wait);
  }, [dispatch, previousAlerts]);

  return (
    <Toast role="alert" isSmall={isSmall}>
      <ToastIcon icon="checkCircle" />
      {t(alert.data)}
    </Toast>
  );
}
