import { Grid } from '@material-ui/core';
import Image from 'next/image';
import { Link } from 'suomifi-ui-components';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { HeaderWrapper, SiteLogo } from './header.styles';

export default function ErrorHeader() {
  const { breakpoint, isSmall } = useBreakpoints();

  return (
    <>
      <HeaderWrapper>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <SiteLogo breakpoint={breakpoint}>
              <Link href="/">
                <Image src={isSmall ? '/logo-small.svg' : '/logo.svg'} width="300" height="43" alt="Logo" />
              </Link>
            </SiteLogo>
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}
