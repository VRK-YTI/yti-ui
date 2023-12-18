import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import { SSRConfig, useTranslation } from 'next-i18next';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import PageHead from 'yti-common-ui/page-head';
import { getOrganizations } from '@app/common/components/organizations/organizations.slice';
import { getSubscriptions } from '@app/common/components/subscription/subscription.slice';
import { getRequests } from '@app/common/components/requests/requests.slice';
import OwnInformation from '@app/modules/own-information';
import { wrapper } from '@app/store';

interface OwnInformationPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function OwnInformationPage(props: OwnInformationPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <PageHead
          baseUrl="https://tietomallit.suomi.fi"
          title={t('datamodel-title')}
          description={t('service-description')}
        />

        <OwnInformation />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale }) => {
    store.dispatch(getOrganizations.initiate({ sortLang: locale ?? 'fi' }));
    store.dispatch(getSubscriptions.initiate());
    store.dispatch(getRequests.initiate());

    return {
      props: {
        requireAuthenticated: true,
      },
    };
  }
);
