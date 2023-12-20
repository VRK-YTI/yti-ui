import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { default as CommonLayout } from './layout';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface LayoutProps {
  user?: MscrUser | null;
  crosswalk?: boolean;
  fakeableUsers?: FakeableUser[] | null;
  feedbackSubject?: string;
  children: React.ReactNode;
}

export default function Layout({
  user,
  crosswalk,
  fakeableUsers,
  feedbackSubject,
  children,
}: LayoutProps): React.ReactElement {
  return (
    <CommonLayout
      user={user ?? undefined}
      crosswalk={crosswalk ?? false}
      fakeableUsers={fakeableUsers ?? []}
      feedbackSubject={feedbackSubject}
    >
      {children}
    </CommonLayout>
  );
}
