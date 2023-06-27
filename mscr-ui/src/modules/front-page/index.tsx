import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import Title from 'yti-common-ui/title';
import FrontPageFilter from './front-page-filter';
import {
  FilterMobileButton,
  ResultAndFilterContainer,
  ResultAndStatsWrapper,
} from './front-page.styles';
import SearchResults, {
  SearchResultData,
} from 'yti-common-ui/search-results/search-results';
import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetSearchModelsQuery } from '@app/common/components/search-models/search-models.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  Button,
  Modal,
  ModalContent,
  SingleSelectData,
} from 'suomifi-ui-components';
import useUrlState from 'yti-common-ui/utils/hooks/use-url-state';
import {
  Description,
  TitleDescriptionWrapper,
} from 'yti-common-ui/title/title.styles';
import Pagination from 'yti-common-ui/pagination';
import { translateModelType } from '@app/common/utils/translation-helpers';
import ModelFormModal from '../model-form/model-form-modal';
import Separator from 'yti-common-ui/separator';
import { ButtonBlock } from '@app/modules/front-page/front-page.styles';
import UpdateWithFileModal from '@app/common/components/update-with-file-modal';

export default function FrontPage() {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: serviceCategoriesData, refetch: refetchServiceCategoriesData } =
    useGetServiceCategoriesQuery(i18n.language);
  const { data: organizationsData, refetch: refetchOrganizationsData } =
    useGetOrganizationsQuery(i18n.language);
  const { data: searchModels, refetch: refetchSearchModels } =
    useGetSearchModelsQuery({
      urlState,
      lang: i18n.language,
    });
  const [showModal, setShowModal] = useState(false);

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

  const languages: SingleSelectData[] = useMemo(() => {
    if (!searchModels || searchModels.totalHitCount < 1) {
      return [];
    }

    let languages: SingleSelectData[] = [];

    searchModels.responseObjects.forEach((object) => {
      if (languages.length === 0) {
        languages = object.language.map((l) => ({
          labelText: l,
          uniqueItemId: l,
        }));
      } else {
        object.language.forEach((l) => {
          if (!languages.map((lang) => lang.uniqueItemId).includes(l)) {
            languages = [...languages, { labelText: l, uniqueItemId: l }];
          }
        });
      }
    });

    return languages;
  }, [searchModels]);

  const data: SearchResultData[] = useMemo(() => {
    if (!searchModels || !organizationsData || !serviceCategoriesData) {
      return [];
    }

    return searchModels.responseObjects.map((object) => {
      const contributors: string[] = object.contributor
        .map((c) =>
          getLanguageVersion({
            data: organizationsData.find(
              (o) => o.id.replace('urn:uuid:', '') === c
            )?.label,
            lang: i18n.language,
            appendLocale: true,
          })
        )
        .filter((c) => c && c.length > 0);

      const partOf: string[] = object.isPartOf
        .map((p) =>
          getLanguageVersion({
            data: serviceCategoriesData.find((c) => c.identifier === p)?.label,
            lang: i18n.language,
          })
        )
        .filter((p) => p.length > 0);

      return {
        id: object.id,
        contributors: contributors,
        description: getLanguageVersion({
          data: object.comment,
          lang: i18n.language,
        }),
        icon: 'applicationProfile',
        status: object.status,
        partOf: partOf,
        title: getLanguageVersion({
          data: object.label,
          lang: i18n.language,
          appendLocale: true,
        }),
        titleLink: `/model/${object.prefix}`,
        type: translateModelType(object.type, t),
      };
    });
  }, [
    searchModels,
    serviceCategoriesData,
    organizationsData,
    i18n.language,
    t,
  ]);

  const refetchInfo = () => {
    refetchOrganizationsData();
    refetchServiceCategoriesData();
    refetchSearchModels();
  };

  const registerSchema = () => {
    // register a new schema
  };

  const registerCrossWalk = () => {
    //Register a new crosswalk
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
        <Button onClick={() => registerSchema()} id="submit-button">
          {t('Register schema', { ns: 'admin' })}
        </Button>
        <Button onClick={() => registerCrossWalk()} id="submit-button">
          {t('Register crosswalks', { ns: 'admin' })}
        </Button>
      </ButtonBlock>
      <Separator />
      <UpdateWithFileModal />
    </main>
  );
}
