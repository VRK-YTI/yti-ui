import React from 'react';
import { Link } from 'suomifi-ui-components';
import Image from 'next/image';
import { LogoWrapper } from './smart-header.styles';
import { useRouter } from 'next/router';

export default function Logo() {
  return (
    <LogoWrapper>
      <Link href="/">
        <Image src={useRouter().basePath + '/logo.svg'} width="186" height="32" alt="Logo" />
      </Link>
    </LogoWrapper>
  );
}
