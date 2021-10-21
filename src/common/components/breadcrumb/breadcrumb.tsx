import { Breadcrumb } from "suomifi-ui-components";
import { BreadcrumbWrappwer } from "./breadcrumb-styles";

export default function BreadcrumbWrapper() {

  // TODO: logic to build breadcrumb

  return (
    <>
      <BreadcrumbWrappwer>
        <Breadcrumb href="/">
          <Breadcrumb.link href="/">
            Etusivu
          </Breadcrumb.link>
          <Breadcrumb.link href="/" current>
            Alasivu
          </Breadcrumb.link>
        </Breadcrumb>
      </BreadcrumbWrappwer>
    </>
  );
}