import React from 'react';
import { Link as SuomiLink } from 'suomifi-ui-components';
import Image from 'next/image';
import Link from 'next/link';
import { LogoWrapper } from './smart-header.styles';
import { useTranslation } from 'next-i18next';

export default function Logo() {
  const { t } = useTranslation('common');

  return (
    <LogoWrapper>
      <Link href="/" passHref legacyBehavior={true}>
        <SuomiLink href="" aria-label={t('navigate-to-homepage')}>
          <Image
            src="/logo.svg"
            width="186"
            height="32"
            alt={t('interoperability-logo-title')}
          />
        </SuomiLink>
      </Link>
    </LogoWrapper>
  );
}
