import { Breadcrumb as SuomiFiBreadcrumb } from 'suomifi-ui-components';
import { BreadcrumbWrapper } from './breadcrumb.styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import BreadcrumbLink from './breadcrumb-link';
import { useBreakpoints } from 'yti-common-ui/media-query';

export interface BreadcrumbProps {
  children: React.ReactNode;
}

export default function Breadcrumb({ children }: BreadcrumbProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  // Returning just the wrapper to have correct space between Title and Header
  if (isSmall) {
    return <BreadcrumbWrapper />;
  }

  return (
    <BreadcrumbWrapper id="breadcrumb">
      <SuomiFiBreadcrumb aria-label={t('breadcrumb')} href="/">
        <BreadcrumbLink url="/">{t('terminology-title')}</BreadcrumbLink>

        {children}
      </SuomiFiBreadcrumb>
    </BreadcrumbWrapper>
  );
}
