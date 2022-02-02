import React from 'react';
import { Link } from 'suomifi-ui-components';
import Image from 'next/image';
import { LogoWrapper } from './smart-header.styles';

/**
 * Error handling:
 * - if logo.svg cannot be loaded
 *   should image return something else?
 */

export default function Logo() {
  return (
    <LogoWrapper>
      <Link href="/">
        <Image src='/logo.svg' width="186" height="32" alt="Logo" />
      </Link>
    </LogoWrapper>
  );
}
