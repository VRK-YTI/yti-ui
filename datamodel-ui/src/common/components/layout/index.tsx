import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { default as CommonLayout } from 'yti-common-ui/layout/layout';
import Matomo from 'yti-common-ui/matomo';
interface LayoutProps {
  user?: User | null;
  fakeableUsers?: FakeableUser[] | null;
  feedbackSubject?: string;
  fullScreenElements?: React.ReactNode;
  headerHidden?: boolean;
  langPickerHidden?: boolean;
  children: React.ReactNode;
  showLanguageMenuLabel?: boolean;
}

export default function Layout({
  user,
  fakeableUsers,
  feedbackSubject,
  fullScreenElements,
  headerHidden,
  langPickerHidden,
  children,
  showLanguageMenuLabel = false,
}: LayoutProps): React.ReactElement {
  return (
    <CommonLayout
      user={user ?? undefined}
      fakeableUsers={fakeableUsers ?? []}
      feedbackSubject={feedbackSubject}
      matomo={<Matomo />}
      fullScreenElements={fullScreenElements}
      headerHidden={headerHidden}
      langPickerHidden={langPickerHidden}
      hideSv={true}
      showLanguageMenuLabel={showLanguageMenuLabel}
    >
      {children}
    </CommonLayout>
  );
}
