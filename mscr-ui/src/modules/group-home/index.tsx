import SideNavigationPanel from "@app/common/components/side-navigation";
import { Grid } from "@mui/material";
import { User } from "yti-common-ui/interfaces/user.interface";
import FrontPage from "../front-page";

interface GroupHomeProps {
  pid: string;
  user?: User | undefined;
}
export default function GroupWorkspace({ pid,user }: GroupHomeProps) {
  {
    return (
      <Grid container spacing={2}>
          <Grid item xs={4}>
            <SideNavigationPanel user={user ?? undefined} />
          </Grid>
          <Grid item xs={8}>
            <FrontPage></FrontPage>
          </Grid>
        </Grid>
    );
  }
}
