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
  const current = paths.slice(-1)[0];
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

          {paths && paths.map((path: string) => {
            return (
              renderBreadcrumbLink(path)
            );
          })}
        </Breadcrumb>
      </BreadcrumbWrapper>
    </>
  );

  function renderBreadcrumbLink(path: string) {
    /*
      If handled breadcrump is equal to active page,
      disable link functionalities.
    */

    const displayValue = ['terminology, search'].some(w => w.includes(path))
      ? t('terminology-title')
      : terminologyValue.value;

    if (current) {
      return (
        <BreadcrumbLink
          aria-label={path}
          current={current === path}
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
            <BreadcrumbLink aria-label={path} current={current === path}>
              {displayValue}
            </BreadcrumbLink>
          </div>
        </Link>
      );
    }
  }
}
