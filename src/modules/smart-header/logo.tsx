import React from 'react';
import { Link } from 'suomifi-ui-components';
import Image from 'next/image';
import { LogoWrapper } from './smart-header.styles';

export interface LogoProps {
  isSmall: boolean;
}

export default function Logo({ isSmall }: LogoProps) {
  return (
    <LogoWrapper>
      <Link href="/">
        <Image src={isSmall ? '/logo-small.svg' : '/logo.svg'} width="186" height="32" alt="Logo" />
      </Link>
    </LogoWrapper>
  );
}
