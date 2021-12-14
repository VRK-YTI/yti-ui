import { Breadcrumb, BreadcrumbLink } from 'suomifi-ui-components';
import { BreadcrumbWrapper } from './breadcrumb-styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentTerminology } from '../vocabulary/vocabulary-slice';

export default function BreadcrumbNav() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const paths = router.asPath.split('/').filter((q: string) => q !== '');
  const terminologyValue = useSelector(selectCurrentTerminology());

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb aria-label="Murupolku" href="/">
          {/*
            BreadcrumbLink needs to be wrapped in a div to remove
            an error using next/link passHref with BreadcrumbLink.
          */}
          <Link href={'/'} passHref>
            <div>
              <BreadcrumbLink aria-label="Etusivu">
                {t('front-page')}
              </BreadcrumbLink>
            </div>
          </Link>

          {paths.map((path: string) => {
            if (path === 'terminology' || path === 'search') {
              return (
                BreadcrumbLinkPart(path, t('terminology-title'))
              );
            } else {
              return (
                BreadcrumbLinkPart(path, terminologyValue.value)
              );
            }
          })}
        </Breadcrumb>
      </BreadcrumbWrapper>
    </>
  );

  function BreadcrumbLinkPart(path: string, displayValue: string) {
    /*
      If handled breadcrump is equal to active page,
      disable link functionalities.
    */
    const current = path === paths.slice(-1)[0];

    if (current) {
      return (
        <BreadcrumbLink
          aria-label={path}
          current={current}
          key={`breadcrumb-${path}`}
        >
          {displayValue}
        </BreadcrumbLink>
      );
    } else {
      return (
        <Link
          key={`breadcrumb-${path}`}
          href={'/search'}
          passHref
        >
          <div>
            <BreadcrumbLink
              aria-label={path}
              current={current}
            >
              {displayValue}
            </BreadcrumbLink>
          </div>
        </Link>
      );
    }
  }
}
