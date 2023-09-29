import SideNavigationPanel from '@app/common/components/side-navigation';
import { Grid } from '@mui/material';
import { User } from 'yti-common-ui/interfaces/user.interface';
import FrontPage from '../front-page';


interface PersonalHomeProps {
  pid: string;
  user?: User | undefined;
}
export default function PersonalWorkspace({ pid, user }: PersonalHomeProps) {
  {
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <SideNavigationPanel user={user}  />
        </Grid>
        <Grid item xs={8}>
          <FrontPage></FrontPage>
        </Grid>
      </Grid>
    );
  }
}

