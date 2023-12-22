import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/components/common-context-provider';
import { SSRConfig } from 'next-i18next';
import Layout from '@app/common/components/layout';
import PageHead from 'yti-common-ui/components/page-head';
import PersonalSettings from 'src/modules/workspace/personal-settings';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import GroupSettings from 'src/modules/workspace/group-settings';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  user: MscrUser;
  settingsType: string;
}

function SettingsByType(settingsType: string): React.ReactElement {
  if (settingsType === 'personal') {
    return <PersonalSettings />;
  }
  return <GroupSettings groupId={settingsType} />;
}

// This is just a mock page. I do not yet understand the proper construction of a page. Replace with real page.
export default function IndexPage(props: IndexPageProps) {
  // console.log('settings type: ', props.settingsType);
  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <PageHead
          baseUrl="https://mscr-test.rahtiapp.fi/"
          title="Settings testisivu"
          description="Only for testing"
        />
        {SettingsByType(props.settingsType)}
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ query }) => {
    const settingsType = Array.isArray(query.homepage)
      ? query.homepage[0]
      : query.homepage;

    if (settingsType === undefined) {
      throw new Error('Invalid parameter for page');
    }

    return {
      props: {
        settingsType: settingsType,
      },
    };
  }
);
