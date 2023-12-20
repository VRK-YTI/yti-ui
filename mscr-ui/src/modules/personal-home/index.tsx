import FrontPage from '../front-page';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface PersonalHomeProps {
  pid: string;
  user?: MscrUser | undefined;
}
export default function PersonalWorkspace({ pid, user }: PersonalHomeProps) {
  {
    return <FrontPage></FrontPage>;
  }
}
