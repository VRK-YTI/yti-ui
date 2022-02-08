import { useState } from 'react';
import {
  useGetCollectionsQuery,
  useGetConceptResultQuery,
  useGetVocabularyQuery,
} from '../../common/components/vocabulary/vocabulary-slice';
import SearchResults from '../../common/components/search-results/search-results';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper, PaginationWrapper } from './vocabulary.styles';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { FilterMobileButton } from '../terminology-search/terminology-search.styles';
import { useTranslation } from 'next-i18next';
import { Modal, ModalContent } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import PropertyValue from '../../common/components/property-value';
import { useGetVocabularyCountQuery } from '../../common/components/counts/counts-slice';
import { TerminologyListFilter } from './terminology-list-filter';
import useUrlState from '../../common/utils/hooks/useUrlState';
import Pagination from '../../common/components/pagination/pagination';
import filterData from '../../common/utils/filter-data';

interface VocabularyProps {
  id: string;
}

export default function Vocabulary({ id }: VocabularyProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { urlState } = useUrlState();
  const { data: collections } = useGetCollectionsQuery(id);
  const { data: concepts } = useGetConceptResultQuery({ id, urlState });
  const { data: info } = useGetVocabularyQuery(id);
  const { data: counts } = useGetVocabularyCountQuery(id);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${id}`} current>
          <PropertyValue property={info?.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

      {info && <Title info={info} />}
      {isSmall &&
        <FilterMobileButton
          variant='secondary'
          fullWidth
          onClick={() => setShowModal(!showModal)}
        >
          {t('vocabulary-filter-filter-list')}
        </FilterMobileButton>
      }
      <ResultAndFilterContainer>
        {(concepts && urlState.type === 'concept') &&
          <ResultAndStatsWrapper>
            <SearchResults data={concepts} />
            <PaginationWrapper>
              <Pagination
                data={concepts}
                pageString={t('pagination-page')}
              />
            </PaginationWrapper>
          </ResultAndStatsWrapper>
        }
        {(collections && urlState.type === 'collection') &&
          <ResultAndStatsWrapper>
            <SearchResults
              data={filterData(collections, urlState, i18n.language) ?? collections}
              type="collections"
            />
            <PaginationWrapper>
              <Pagination
                data={filterData(collections, urlState, i18n.language) ?? collections}
                pageString={t('pagination-page')}
              />
            </PaginationWrapper>
          </ResultAndStatsWrapper>
        }
        {!isSmall
          ?
          <TerminologyListFilter counts={counts} />
          :
          <Modal
            appElementId='__next'
            visible={showModal}
            onEscKeyDown={() => setShowModal(false)}
            variant='smallScreen'
            style={{ border: 'none' }}
          >
            <ModalContent style={{ padding: '0' }}>
              <TerminologyListFilter
                isModal
                onModalClose={() => setShowModal(false)}
                resultCount={concepts?.totalHitCount}
                counts={counts}
              />
            </ModalContent>
          </Modal>
        }
      </ResultAndFilterContainer>
    </>
  );
};
