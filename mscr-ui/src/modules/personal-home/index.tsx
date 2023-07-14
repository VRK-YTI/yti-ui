import { User } from 'yti-common-ui/interfaces/user.interface';
import Title from 'yti-common-ui/title';

export default function PersonalWorkspace({ user }: { user?: User }) {
  return (
    <Title title={user ? user.firstName + `'s workspace` : 'Anonymous user'} />
  );
}
