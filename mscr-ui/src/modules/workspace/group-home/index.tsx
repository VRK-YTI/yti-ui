import { Type } from '@app/common/interfaces/search.interface';
import { useGetOrgContentQuery } from '@app/common/components/organization/organization.slice';
import { useTranslation } from 'next-i18next';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import WorkspaceTable from '@app/modules/workspace/workspace-table';
import Title from 'yti-common-ui/components/title';
import { Description, TitleDescriptionWrapper } from 'yti-common-ui/components/title/title.styles';
import Separator from 'yti-common-ui/components/separator';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

interface GroupHomeProps {
  user: MscrUser;
  pid: string;
  contentType: Type;
}
export default function GroupWorkspace({ user, pid, contentType }: GroupHomeProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { data, isLoading } = useGetOrgContentQuery({
    type: contentType as string,
    ownerOrg: pid,
  });

  if (isLoading) {
    return <div> Is Loading </div>; //ToDo: A loading circle or somesuch
  } else if (!user || user.anonymous || !user.rolesInOrganizations[pid]) {
    return <div> You do not have rights to view this page </div>;
  } else {
    return (
      <main id="main">
        <Title
          title={'Metadata Schema and Crosswalk Registry'}
          noBreadcrumbs={true}
          extra={
            <TitleDescriptionWrapper $isSmall={isSmall}>
              <Description id="page-description">
                {t('service-description')}
              </Description>
            </TitleDescriptionWrapper>
          }
        />
        <Separator isLarge />
        {/* ToDo: From these buttons you should create content with this org as owner */}
        {/*<ButtonBlock>*/}
        {/*  {contentType == 'SCHEMA' ? (*/}
        {/*    <SchemaFormModal refetch={refetchInfo}></SchemaFormModal>*/}
        {/*  ) : (*/}
        {/*    <>*/}
        {/*      <CrosswalkFormModal refetch={refetchInfo}></CrosswalkFormModal>*/}
        {/*      <CrosswalkSelectionModal*/}
        {/*        refetch={refetchInfo}*/}
        {/*      ></CrosswalkSelectionModal>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</ButtonBlock>*/}

        {data?.hits.hits && data?.hits.hits.length < 1 ? (
          <div>
            {contentType == 'SCHEMA'
              ? t('workspace.no-schemas')
              : t('workspace.no-crosswalks')}
          </div>
        ) : (
          <WorkspaceTable data={data} contentType={contentType} />
        )}
      </main>
    );
  }
}
