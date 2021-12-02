import AuthenticationPanel from '../../common/components/authentication-panel/authentication-panel';
import User from '../../common/interfaces/user-interface';
import { AuthenticationPanelWrapper } from './smart-header.styles';

export interface DesktopAuthenticationPanelProps {
  props: {
    user?: User;
    isSmall: boolean;
  };
}

export default function DesktopAuthenticationPanel({ props: { user, isSmall } }: DesktopAuthenticationPanelProps) {
  return (
    <AuthenticationPanelWrapper>
      <AuthenticationPanel props={{ user, isSmall }} />
    </AuthenticationPanelWrapper>
  );
}
