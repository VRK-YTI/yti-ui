import { Breadcrumb as SuomiFiBreadcrumb } from 'suomifi-ui-components';
import { BreadcrumbWrapper } from './breadcrumb-styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import BreadcrumbLink from './breadcrumb-link';

export interface BreadcrumbProps {
  children: React.ReactNode;
}

export default function Breadcrumb({ children }: BreadcrumbProps) {
  const { t } = useTranslation('common');

  return (
    <BreadcrumbWrapper>
      <SuomiFiBreadcrumb aria-label={t('breadcrumb')} href="/">
        <BreadcrumbLink url="/">{t('front-page')}</BreadcrumbLink>

        {children}
      </SuomiFiBreadcrumb>
    </BreadcrumbWrapper>
  );
}
