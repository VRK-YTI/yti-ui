import { Breadcrumb, BreadcrumbLink } from 'suomifi-ui-components';
import { BreadcrumbWrapper } from './breadcrumb-styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function BreadcrumbNav() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const paths = router.asPath.split('/').filter((q: string) => q !== '');

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
                <Link
                  key={`breadcrumb-${path}`}
                  href={'/search'}
                  passHref
                >
                  <div>
                    <BreadcrumbLink
                      aria-label={path}
                      current={path === paths.slice(-1)[0]}
                    >
                      {t('terminology-title')}
                    </BreadcrumbLink>
                  </div>
                </Link>
              );
            }

          })}
        </Breadcrumb>
      </BreadcrumbWrapper>
    </>
  );
}
