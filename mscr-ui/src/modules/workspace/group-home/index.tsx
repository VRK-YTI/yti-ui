import FrontPage from '../front-page';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface GroupHomeProps {
  pid: string;
  user?: MscrUser | undefined;
}
export default function GroupWorkspace({ pid, user }: GroupHomeProps) {
  {
    return (
      <>
        <p>This is the group content page for group with (p)id {pid}</p>
        <FrontPage></FrontPage>
      </>
    );
  }
}
