import React from 'react';
import styled from 'styled-components';
import { Link as SuomiLink } from 'suomifi-ui-components';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const StyledSuomiLink = styled(SuomiLink)`
  line-height: 0;
  margin-right: auto;
`;

export default function Logo() {
  const { t } = useTranslation('common');

  return (
    <Link href="/" passHref>
      <StyledSuomiLink aria-label={t('navigate-to-homepage')}>
        <Image
          className="logo-image"
          src="/supporting_eosc.png"
          width="256"
          height="61"
          alt={'Supporting EOSC'}
        />
      </StyledSuomiLink>
    </Link>
  );
}
