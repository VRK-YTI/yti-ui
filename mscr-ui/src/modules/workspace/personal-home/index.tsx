import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { PaginatedQuery, Type } from '@app/common/interfaces/search.interface';
import WorkspaceTable from 'src/modules/workspace/workspace-table';
import { useTranslation } from 'next-i18next';
import Title from 'yti-common-ui/components/title';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/components/title/title.styles';
import Separator from 'yti-common-ui/components/separator';
import SchemaFormModal from '@app/modules/form/schema-form/schema-form-modal';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import CrosswalkFormModal from '@app/modules/form/crosswalk-form/crosswalk-form-modal';
import { ButtonBlock } from '@app/modules/workspace/workspace.styles';
import { useState } from 'react';
import Pagination from '@app/common/components/pagination';

export default function PersonalWorkspace({
  contentType,
}: {
  contentType: Type;
}) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const query: PaginatedQuery = {
    type: contentType,
    pageSize,
    pageFrom: (currentPage - 1) * pageSize,
  };
  const { data, isLoading } = useGetPersonalContentQuery(query);
  const lastPage = data?.hits.total?.value
    ? Math.ceil(data?.hits.total.value / pageSize)
    : 0;
  const { refetch: refetchOrganizationsData } = useGetOrganizationsQuery(
    i18n.language
  );

  // Need to decide what data we want to fetch loading the application
  const refetchInfo = () => {
    refetchOrganizationsData();
  };

  if (isLoading) {
    return <div> Is Loading </div>; //ToDo: A loading circle or somesuch
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
        <ButtonBlock>
          {contentType == 'SCHEMA' ? (
            <>
              {/*Just sending empty string as pid for personal content*/}
              <SchemaFormModal refetch={refetchInfo} groupContent={false}></SchemaFormModal>
            </>
          ) : (
            <>
              <CrosswalkFormModal refetch={refetchInfo}  groupContent={false}></CrosswalkFormModal>
              <CrosswalkFormModal
                refetch={refetchInfo}
                createNew={true}
                groupContent={false}
              ></CrosswalkFormModal>
            </>
          )}
        </ButtonBlock>
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
