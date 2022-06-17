import Error from '@app/common/components/error/error';
import ErrorLayout from '@app/layouts/error-layout';
import {
  CommonContextProvider,
  initialCommonContextState,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';

export default function Custom500() {
  return (
    <CommonContextProvider value={initialCommonContextState}>
      <ErrorLayout>
        <PageHead
          title="Error"
          siteTitle="Yhteentoimivuusalusta"
          description="An error occured"
        />

        <Error errorCode={500} />
      </ErrorLayout>
    </CommonContextProvider>
  );
}
