import { User } from 'yti-common-ui/interfaces/user.interface';
import FrontPage from '../front-page';

interface PersonalHomeProps {
  pid: string;
  user?: User | undefined;
}
export default function PersonalWorkspace({ pid, user }: PersonalHomeProps) {
  {
    return (
      <>
        <p>This is the personal content page for user {user?.firstName}</p>
        <FrontPage></FrontPage>
      </>
    );
  }
}
