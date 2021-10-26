import { Grid } from '@material-ui/core';
import Image from 'next/image';
import { Link } from 'suomifi-ui-components';
import { LayoutProps } from '../layout/layout-props';
import { HeaderWrapper, SiteLogo } from './header.styles';

export default function ErrorHeader({ props }: { props: LayoutProps }) {
  const isLarge = props.isLarge;

  return (
    <>
      <HeaderWrapper>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SiteLogo>
              <Link href="/">
                {isLarge ? (
                  <Image src="/logo-suomi.fi.png" width="254" height="70" alt="Logo" />
                ) : (
                  <Image height="40" width="40" src="/logo.png"  alt="Logo" />
                )
                }
              </Link>
            </SiteLogo>
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}
