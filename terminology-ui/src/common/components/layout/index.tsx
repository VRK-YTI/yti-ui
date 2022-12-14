import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { default as CommonLayout } from 'yti-common-ui/layout/layout';
import Alerts from '../alert';
import Matomo from '../matomo';

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
  return (
    <CommonLayout
      user={user ?? undefined}
      fakeableUsers={fakeableUsers ?? []}
      feedbackSubject={feedbackSubject}
      matomo={<Matomo />}
      alerts={<Alerts />}
    >
      {children}
    </CommonLayout>
  );
}
