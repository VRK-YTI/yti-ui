import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { default as CommonLayout } from 'yti-common-ui/layout/layout';
import Alerts from 'yti-common-ui/alerts';
import Matomo from 'yti-common-ui/matomo';
import { Alert } from 'yti-common-ui/interfaces/alert';
import { useStoreDispatch } from '@app/store';
import { selectAlert, setAlertVisibility } from '../alert/alert.slice';
import { useSelector } from 'react-redux';

interface LayoutProps {
  user?: User | null;
  fakeableUsers?: FakeableUser[] | null;
  feedbackSubject?: string;
  children: React.ReactNode;
}

export default function Layout({
  user,
  fakeableUsers,
  feedbackSubject,
  children,
}: LayoutProps): React.ReactElement {
  const dispatch = useStoreDispatch();
  const alerts = useSelector(selectAlert());

  const setVisibility = (alerts: Alert[], displayText: string) => {
    dispatch(setAlertVisibility(alerts, displayText));
  };

  return (
    <CommonLayout
      user={user ?? undefined}
      fakeableUsers={fakeableUsers ?? []}
      feedbackSubject={feedbackSubject}
      matomo={<Matomo />}
      alerts={<Alerts alerts={alerts} setAlertVisibility={setVisibility} />}
    >
      {children}
    </CommonLayout>
  );
}
