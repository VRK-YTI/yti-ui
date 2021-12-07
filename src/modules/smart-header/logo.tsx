import React from 'react';
import { Link } from 'suomifi-ui-components';
import Image from 'next/image';
import { LogoWrapper } from './smart-header.styles';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';

export default function Logo() {
  const { isSmall } = useBreakpoints();

  return (
    <LogoWrapper>
      <Link href="/">
        <Image src={isSmall ? '/logo-small.svg' : '/logo.svg'} width="186" height="32" alt="Logo" />
      </Link>
    </LogoWrapper>
  );
}
