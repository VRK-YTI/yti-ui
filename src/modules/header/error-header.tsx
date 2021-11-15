import { Grid } from '@material-ui/core';
import Image from 'next/image';
import { Link } from 'suomifi-ui-components';
import { LayoutProps } from '../../layouts/layout-props';
import { HeaderWrapper, SiteLogo } from './header.styles';

export default function ErrorHeader({ props }: { props: LayoutProps }) {

  return (
    <>
      <HeaderWrapper>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SiteLogo>
              <Link href="/">
                <Image src={props.isSmall ? '/logo-small.svg' : '/logo.svg'} width="300" height="43" alt="Logo" />
              </Link>
            </SiteLogo>
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}
