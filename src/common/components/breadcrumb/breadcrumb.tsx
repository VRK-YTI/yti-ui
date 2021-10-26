import { Breadcrumb, BreadcrumbLink } from 'suomifi-ui-components';
import { BreadcrumbWrappwer } from './breadcrumb-styles';

export default function BreadcrumbWrapper() {

  // TODO: logic to build breadcrumb

  return (
    <>
      <BreadcrumbWrappwer>
        <Breadcrumb aria-label="Murupolku" href="/">
          <BreadcrumbLink aria-label="Etusivu"  href="/">
            Etusivu
          </BreadcrumbLink>
          <BreadcrumbLink aria-label="Alasivu" href="/" current>
            Alasivu
          </BreadcrumbLink>
        </Breadcrumb>
      </BreadcrumbWrappwer>
    </>
  );
}
