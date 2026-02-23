import React from 'react';
import Link from 'next/link';
import { BreadcrumbLink as SuomiFiBreadcrumbLink } from 'suomifi-ui-components';

export interface BreadcrumbLinkProps {
  url: string;
  current?: boolean;
  children: React.ReactNode;
}

export default function BreadcrumbLink({
  url,
  current = false,
  children,
}: BreadcrumbLinkProps) {
  if (current) {
    return (
      <SuomiFiBreadcrumbLink asProp={Link} current={current}>
        {children}
      </SuomiFiBreadcrumbLink>
    );
  }

  return (
    <div>
      <SuomiFiBreadcrumbLink
        asProp={Link}
        href={url}
        current={current}
        className="breadcrumb-link"
      >
        {children}
      </SuomiFiBreadcrumbLink>
    </div>
  );
}
