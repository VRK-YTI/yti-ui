import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import Title from 'yti-common-ui/title';
import { SearchResultData } from 'yti-common-ui/search-results/search-results';
import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { SingleSelectData } from 'suomifi-ui-components';
import useUrlState from 'yti-common-ui/utils/hooks/use-url-state';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import { translateModelType } from '@app/common/utils/translation-helpers';
import Separator from 'yti-common-ui/separator';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';
import SchemaFormModal from '../schema-form/schema-form-modal';

export default function FrontPage() {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: serviceCategoriesData, refetch: refetchServiceCategoriesData } =
    useGetServiceCategoriesQuery(i18n.language);
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

  const serviceCategories = useMemo(() => {
    if (!serviceCategoriesData) {
      return [];
    }

    return serviceCategoriesData.map((category) => ({
      id: category.identifier,
      label: category.label[i18n.language],
    }));
  }, [serviceCategoriesData, i18n.language]);

  // Need to decide what data we want to fetch loading the application
  const refetchInfo = () => {
    refetchOrganizationsData();
    refetchServiceCategoriesData();
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
      <SchemaFormModal refetch={refetchInfo}></SchemaFormModal>
      <Separator />
      <UpdateWithFileModal />
    </main>
  );
}
