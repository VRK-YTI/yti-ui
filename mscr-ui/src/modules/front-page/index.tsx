import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import Title from 'yti-common-ui/title';
import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { useBreakpoints } from 'yti-common-ui/media-query';
import useUrlState from 'yti-common-ui/utils/hooks/use-url-state';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import Separator from 'yti-common-ui/separator';
import SchemaFormModal from '../schema-form/schema-form-modal';
import CrosswalkFormModal from '../crosswalk-form/crosswalk-form-modal';
import { ButtonBlock } from './front-page.styles';
import BasicTable from '@app/common/components/table';
import CrosswalkSelectionModal from '@app/modules/create-crosswalk/crosswalk-selection-modal';

export default function FrontPage() {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: organizationsData, refetch: refetchOrganizationsData } =
    useGetOrganizationsQuery(i18n.language);

  const organizations = useMemo(() => {
    if (!organizationsData) {
      return [];
    }

    return organizationsData.map((org) => {
      const id = org.id.replaceAll('urn:uuid:', '');
      return {
        id: id,
        label: org.label[i18n.language] ?? org.label['fi'],
      };
    });
  }, [organizationsData, i18n.language]);

  // Need to decide what data we want to fetch loading the application
  const refetchInfo = () => {
    refetchOrganizationsData();
  };

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
        <CrosswalkFormModal refetch={refetchInfo}></CrosswalkFormModal>
        <CrosswalkSelectionModal
          refetch={refetchInfo}
        ></CrosswalkSelectionModal>
      </ButtonBlock>
      <Separator isLarge />
      <BasicTable></BasicTable>
      <Separator isLarge />
    </main>
  );
}
