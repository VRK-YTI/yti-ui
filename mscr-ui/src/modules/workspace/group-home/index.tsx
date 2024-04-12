import { PaginatedQuery, Type } from '@app/common/interfaces/search.interface';
import { useGetOrgContentQuery } from '@app/common/components/organization/organization.slice';
import { useTranslation } from 'next-i18next';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import WorkspaceTable from '@app/modules/workspace/workspace-table';
import Title from 'yti-common-ui/components/title';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/components/title/title.styles';
import Separator from 'yti-common-ui/components/separator';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { useState } from 'react';
import Pagination from '@app/common/components/pagination';
import CrosswalkFormModal from '@app/modules/form/crosswalk-form/crosswalk-form-modal';
import SchemaFormModal from '@app/modules/form/schema-form/schema-form-modal';
import { ButtonBlock } from '../workspace.styles';


interface GroupHomeProps {
  user: MscrUser;
  pid: string;
  contentType: Type;
}
export default function GroupWorkspace({
  user,
  pid,
  contentType,
}: GroupHomeProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const query: PaginatedQuery = {
    type: contentType,
    ownerOrg: pid,
    pageSize,
    pageFrom: (currentPage - 1) * pageSize,
  };
  const { data, isLoading } = useGetOrgContentQuery(query);
  const lastPage = data?.hits.total?.value
    ? Math.ceil(data?.hits.total.value / pageSize)
    : 0;

   // Need to decide what data we want to fetch loading the application
  const refetchInfo = () => {
  }
  
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
        <div>
        <ButtonBlock>
          {contentType == 'SCHEMA' ? (
            <SchemaFormModal refetch={refetchInfo} groupContent={true} pid={pid}></SchemaFormModal>
          ) : (
            <>
                <CrosswalkFormModal refetch={refetchInfo} groupContent={true} pid={pid}></CrosswalkFormModal>
                <CrosswalkFormModal groupContent={true} pid={pid}
                refetch={refetchInfo}
                createNew={true}
              ></CrosswalkFormModal>
          
            </>
          )}
          </ButtonBlock>
          </div>
        <Separator isLarge />
        {data?.hits.hits && data?.hits.hits.length < 1 ? (
          <div>
            {contentType == 'SCHEMA'
              ? t('workspace.no-schemas')
              : t('workspace.no-crosswalks')}
          </div>
        ) : (
          <WorkspaceTable data={data} contentType={contentType} />
        )}
        {lastPage > 1 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            lastPage={lastPage}
          />
        )}
      </main>
    );
  }
}
