import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Type } from '@app/common/interfaces/search.interface';
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

export default function PersonalWorkspace({
  contentType,
}: {
  contentType: Type;
}) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { data, isLoading } = useGetPersonalContentQuery(contentType);
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
              <SchemaFormModal refetch={refetchInfo}></SchemaFormModal>
            </>
          ) : (
            <>
              <CrosswalkFormModal refetch={refetchInfo}></CrosswalkFormModal>
              <CrosswalkFormModal refetch={refetchInfo} createNew={true}></CrosswalkFormModal>
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
      </main>
    );
  }
}
