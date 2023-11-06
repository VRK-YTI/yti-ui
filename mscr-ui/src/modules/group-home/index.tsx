import SideNavigationPanel from '@app/common/components/side-navigation';
import { Grid } from '@mui/material';
import FrontPage from '../front-page';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface GroupHomeProps {
  pid: string;
  user?: MscrUser | undefined;
}
export default function GroupWorkspace({ pid, user }: GroupHomeProps) {
  {
    return (
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <SideNavigationPanel user={user ?? undefined} />
        </Grid>
        <Grid item xs={10}>
          <FrontPage></FrontPage>
        </Grid>
      </Grid>
    );
  }
}
