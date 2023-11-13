import Error from 'yti-common-ui/error/error';
import ErrorLayout from 'yti-common-ui/layout/error-layout';
import {
  CommonContextProvider,
  initialCommonContextState,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';

export default function Custom404() {
  return (
    <CommonContextProvider value={initialCommonContextState}>
      <ErrorLayout>
        <PageHead
          baseUrl="https://tietomallit.suomi.fi"
          title="Error"
          siteTitle="Yhteentoimivuusalusta"
          description="An error occured"
        />

        <Error />
      </ErrorLayout>
    </CommonContextProvider>
  );
}
