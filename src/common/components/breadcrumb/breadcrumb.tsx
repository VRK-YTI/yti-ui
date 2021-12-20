import { Breadcrumb, BreadcrumbLink } from 'suomifi-ui-components';
import { BreadcrumbWrapper } from './breadcrumb-styles';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface BreadcrumbVariantProps {
  title: {
    url: string;
    value: string;
  };
  breadcrumbs?: {
    url: string;
    value: string;
  }[];
}

export default function BreadcrumbNav({ title, breadcrumbs }: BreadcrumbVariantProps) {
  const { t } = useTranslation('common');

  return (
    <BreadcrumbWrapper>
      <Breadcrumb aria-label="Breadcrumb" href="/">
        <Link href={'/'} passHref>
          <div>
            <BreadcrumbLink aria-label="Front page">
              {t('front-page')}
            </BreadcrumbLink>
          </div>
        </Link>

        {breadcrumbs && breadcrumbs.map(breadcrumb => {
          return (
            renderBreadcrumbLink(breadcrumb)
          );
        })}

        {renderBreadcrumbLink(title, true)}
      </Breadcrumb>
    </BreadcrumbWrapper>
  );

  function renderBreadcrumbLink(crumb: BreadcrumbVariantProps['title'], current?: boolean) {
    if (!current) {
      if (crumb.url === 'search') {
        return (
          <Link
            key={`breadcrumb-${crumb.value}`}
            href={`/${crumb.url}?page=1`}
            passHref
          >
            <div>
              <BreadcrumbLink aria-label={crumb.value}>
                {crumb.value}
              </BreadcrumbLink>
            </div>
          </Link>
        );
      } else {
        return (
          <Link
            key={`breadcrumb-${crumb.value}`}
            href={`/terminology/${crumb.url}`}
            passHref
          >
            <div>
              <BreadcrumbLink aria-label={crumb.value}>
                {crumb.value}
              </BreadcrumbLink>
            </div>
          </Link>
        );
      }
    } else {
      return (
        <BreadcrumbLink
          key={`breadcrumb-${crumb.value}`}
          aria-label={crumb.value}
          current
        >
          {crumb.value}
        </BreadcrumbLink>
      );
    }
  }
}
