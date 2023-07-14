import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { default as CommonLayout } from './layout';

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
    >
      {children}
    </CommonLayout>
  );
}
