import {CommonContextProvider, CommonContextState} from 'yti-common-ui/components/common-context-provider';
import {SSRConfig, useTranslation} from 'next-i18next';
import Layout from '@app/common/components/layout';
import PageHead from 'yti-common-ui/components/page-head';
import PersonalSettings from 'src/modules/personal-settings';
import {createCommonGetServerSideProps} from '@app/common/utils/create-getserversideprops';
import {User} from 'yti-common-ui/interfaces/user.interface';
import GroupSettings from '@app/modules/group-settings';
interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  settingsType: string;
}

function SettingsByType( settingsType : string): React.ReactElement  {
  if (settingsType === 'personal') {
    return <PersonalSettings />;
  }
  return <GroupSettings groupId={settingsType} />;
}

// This is just a mock page. I do not yet understand the proper construction of a page. Replace with real page.
export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');
  console.log('settings type: ', props.settingsType);
  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <PageHead
          baseUrl="https://tietomallit.suomi.fi"
          title='Settings testisivu'
          description='Only for testing'
        />
        {SettingsByType(props.settingsType)}
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({query}) => {
    const settingsType = Array.isArray(query.homepage)
      ? query.homepage[0]
      : query.homepage;

    if (settingsType === undefined) {
      throw new Error('Invalid parameter for page');
    }
    console.log(settingsType);

    return {
      props: {
        settingsType: settingsType
      },
    };
  }
);
