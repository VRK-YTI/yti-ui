import React from 'react';
import Link from 'next/link';
import { BreadcrumbLink as SuomiFiBreadcrumbLink } from 'suomifi-ui-components';

export interface BreadcrumbLinkProps {
  url: string;
  current?: boolean;
  children: React.ReactNode;
}

export default function BreadcrumbLink({ url, current = false, children }: BreadcrumbLinkProps) {
  if (current) {
    return (
      <SuomiFiBreadcrumbLink current={current}>
        {children}
      </SuomiFiBreadcrumbLink>
    );
  }

  return (
    <Link href={url} passHref>
      <div>
        <SuomiFiBreadcrumbLink current={current}>
          {children}
        </SuomiFiBreadcrumbLink>
      </div>
    </Link>
  );
}
