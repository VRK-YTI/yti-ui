import useMountEffect from '@app/common/utils/hooks/use-mount-effect';
import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { createRef, useEffect, useState } from 'react';
import { SingleSelectData } from 'suomifi-ui-components';
import { DetachedPagination } from 'yti-common-ui/pagination';
import { useSearchConceptMutation } from '../concept/concept.slice';
import { RelationalModalBlock } from './relation-information-block.styles';
import RenderConcepts from './render-concepts';
import Search from './search';
import { getNamespace } from '@app/common/utils/namespace';
import {
  ConceptResponseObject,
  SearchResponse,
} from '@app/common/interfaces/interfaces-v2';

interface RelationModalContentProps {
  fromOther?: boolean;
  chosen: ConceptResponseObject[] | RelationInfoType[];
  setChosen: (value: ConceptResponseObject[] | RelationInfoType[]) => void;
  searchResults: ConceptResponseObject[];
  setSearchResults: (value: ConceptResponseObject[]) => void;
  terminologyId: string;
  initialChosenConcepts: string[];
}

export interface StatusesType {
  name: string;
  uniqueItemId: string;
  labelText: string;
}

export default function RelationModalContent({
  fromOther,
  chosen,
  setChosen,
  searchResults,
  setSearchResults,
  terminologyId,
  initialChosenConcepts,
}: RelationModalContentProps) {
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const [searchConcept, result] = useSearchConceptMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<
    (StatusesType & SingleSelectData) | null
  >();
  const [totalResults, setTotalResults] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const modalRef = createRef<HTMLDivElement>();
  const pageSize = 20;
  const namespace = getNamespace(terminologyId);

  const statuses: StatusesType[] = [
    {
      name: 'VALID',
      uniqueItemId: 'VALID',
      labelText: t('statuses.valid', { ns: 'common' }),
    },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('statuses.incomplete', { ns: 'common' }),
    },
    {
      name: 'DRAFT',
      uniqueItemId: 'DRAFT',
      labelText: t('statuses.draft', { ns: 'common' }),
    },
    {
      name: 'RETIRED',
      uniqueItemId: 'RETIRED',
      labelText: t('statuses.retired', { ns: 'common' }),
    },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('statuses.superseded', { ns: 'common' }),
    },
    {
      name: 'INVALID',
      uniqueItemId: 'INVALID',
      labelText: t('statuses.invalid', { ns: 'common' }),
    },
  ];

  const handleSearch = () => {
    searchConcept({
      ...(fromOther ? { excludeNamespace: namespace } : { namespace }),
      query: searchTerm,
      ...(status?.uniqueItemId && { status: [status.uniqueItemId] }),
      pageFrom: (currPage - 1) * 20,
      pageSize: 20,
      extendTerminologies: true,
    });
  };

  const handleClearValues = () => {
    setSearchTerm('');
    setStatus(null);

    if (fromOther) {
      result.reset();
      return;
    }

    searchConcept({
      ...(fromOther ? { excludeNamespace: namespace } : { namespace }),
      pageFrom: (currPage - 1) * pageSize,
      pageSize,
      extendTerminologies: true,
    });
  };

  const handlePageChange = (num: number) => {
    setCurrPage(num);
    searchConcept({
      ...(fromOther ? { excludeNamespace: terminologyId } : { namespace }),
      query: searchTerm,
      ...(status?.uniqueItemId && { status: [status.uniqueItemId] }),
      pageFrom: (num - 1) * pageSize,
      pageSize,
      extendTerminologies: true,
    });
    focusToTop();
  };

  const focusToTop = () => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (result.isUninitialized) {
      setSearchResults([]);
      setTotalResults(0);
    }

    if (result.isSuccess) {
      setSearchResults(result.data.responseObjects);

      const totalHits =
        !fromOther && typeof query.conceptId !== 'undefined'
          ? result.data.responseObjects
              .map((c) => c.id)
              .includes(
                Array.isArray(query.conceptId)
                  ? query.conceptId[0]
                  : query.conceptId
              )
            ? result.data.totalHitCount - 1
            : result.data.totalHitCount
          : result.data.totalHitCount;
      setTotalResults(totalHits);
    }
  }, [
    setSearchResults,
    setTotalResults,
    fromOther,
    result,
    initialChosenConcepts,
    query.conceptId,
  ]);

  useMountEffect(handleSearch, fromOther);

  return (
    <RelationalModalBlock>
      <div ref={modalRef} />
      <Search
        handleSearch={handleSearch}
        handleClearValues={handleClearValues}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setStatus={setStatus}
        status={status}
        statuses={statuses}
        totalHitCount={totalResults}
      />

      <RenderConcepts
        concepts={searchResults}
        chosen={chosen}
        setChosen={setChosen}
      />

      <DetachedPagination
        currentPage={currPage}
        maxPages={Math.ceil(totalResults / 20)}
        maxTotal={20}
        setCurrentPage={handlePageChange}
      />
    </RelationalModalBlock>
  );
}
