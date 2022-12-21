import { Concepts } from '@app/common/interfaces/concepts.interface';
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

interface RelationModalContentProps {
  fromOther?: boolean;
  chosen: Concepts[] | RelationInfoType[];
  setChosen: (value: Concepts[] | RelationInfoType[]) => void;
  searchResults: Concepts[];
  setSearchResults: (value: Concepts[]) => void;
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
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
      query: searchTerm,
      status: status?.uniqueItemId,
      pageFrom: (currPage - 1) * 20,
      pageSize: 20,
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
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
    });
  };

  const handlePageChange = (num: number) => {
    setCurrPage(num);
    searchConcept({
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
      query: searchTerm,
      status: status?.uniqueItemId,
      pageFrom: (num - 1) * 20,
      pageSize: 20,
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
      setSearchResults(result.data.concepts);

      const totalHits =
        !fromOther && typeof query.conceptId !== 'undefined'
          ? result.data.concepts
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
        maxPages={Math.round(totalResults / 2)}
        maxTotal={2}
        setCurrentPage={handlePageChange}
      />
    </RelationalModalBlock>
  );
}
