import FrontPage from '../../front-page';
import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Type } from '@app/common/interfaces/search.interface';
import WorkspaceTable, { TableContent } from '@app/common/components/workspace-table';
import { useTranslation } from 'next-i18next';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import router, { useRouter } from 'next/router';
import Title from 'yti-common-ui/components/title';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/components/title/title.styles';
import Separator from 'yti-common-ui/components/separator';
import { ButtonBlock } from '@app/modules/front-page/front-page.styles';
import SchemaFormModal from '@app/modules/schema-form/schema-form-modal';
import CrosswalkFormModal from '@app/modules/crosswalk-form/crosswalk-form-modal';
import CrosswalkSelectionModal from '@app/modules/create-crosswalk/crosswalk-selection-modal';
import BasicTable from '@app/common/components/table';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { Typography } from '@mui/material';

export default function PersonalWorkspace({
  contentType,
}: {
  contentType: Type;
}) {
  const { t, i18n} = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const lang = router.locale ?? '';
  const { data, isLoading } = useGetPersonalContentQuery(contentType);
  const { refetch: refetchOrganizationsData } =
    useGetOrganizationsQuery(i18n.language);

  // Need to decide what data we want to fetch loading the application
  const refetchInfo = () => {
    refetchOrganizationsData();
  };

  const items: { [key: string]: string }[] | undefined = data?.hits.hits.map(
    (result) => {
      const info = result._source;
      const itemDisplay: { [key: string]: string } = {};
      itemDisplay.label = getLanguageVersion({
        data: info.label,
        lang,
      });
      itemDisplay.namespace = info.namespace;
      itemDisplay.state = info.state;
      itemDisplay.numberOfRevisions = info.numberOfRevisions.toString();
      itemDisplay.pid = info.id;
      return itemDisplay;
    }
  );
  console.log('items: ', items);
  const keysWithTranslations = [
    {
      key: 'label',
      translation: t('workspace.label'),
    },
    {
      key: 'namespace',
      translation: t('workspace.namespace'),
    },
    {
      key: 'state',
      translation: t('workspace.state'),
    },
    {
      key: 'numberOfRevisions',
      translation: t('workspace.numberOfRevisions'),
    },
    {
      key: 'pid',
      translation: t('workspace.pid'),
    },
  ];

  const tableContent: TableContent = {
    ariaLabel:
      contentType == 'SCHEMA'
        ? t('workspace.schemas')
        : t('workspace.crosswalks'),
    headers: keysWithTranslations.map((key) => ({
      headerKey: key.key,
      text: key.translation,
    })),
    rows: items?.map((item) => {
      return {
        rowKey: item.pid,
        rowContent: keysWithTranslations.map((key) => ({
          cellKey: key.key,
          cellContent: item[key.key],
        })),
      };
    }),
  };

  if (contentType == undefined) {
    console.log('content type undefined');
    return <FrontPage></FrontPage>;
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
          <SchemaFormModal refetch={refetchInfo}></SchemaFormModal>
        </ButtonBlock>
        <Separator isLarge />
        <Typography marginTop={5}>
          {tableContent.ariaLabel}
        </Typography>
        <WorkspaceTable content={tableContent}></WorkspaceTable>
      </main>
    );
  }
}
