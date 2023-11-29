import { User } from 'yti-common-ui/interfaces/user.interface';
import FrontPage from '../front-page';
import SideNavigationPanel from '@app/common/components/side-navigation';
import { Grid } from '@mui/material';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface PersonalHomeProps {
  pid: string;
  user?: MscrUser | undefined;
}
export default function PersonalWorkspace({ pid, user }: PersonalHomeProps) {
  {
    return (
      <Grid container spacing={2}>
      <Grid item xs={2}>
        <SideNavigationPanel user={user} />
      </Grid>
      <Grid item xs={10}>
        <FrontPage></FrontPage>
      </Grid>
    </Grid>

    );
  }
}
