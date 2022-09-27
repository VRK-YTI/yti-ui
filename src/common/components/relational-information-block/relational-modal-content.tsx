import { Concepts } from '@app/common/interfaces/concepts.interface';
import useMountEffect from '@app/common/utils/hooks/use-mount-effect';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { SingleSelectData } from 'suomifi-ui-components';
import { useSearchConceptMutation } from '../concept/concept.slice';
import { LocalPagination } from '../pagination/pagination';
import RenderConcepts from './render-concepts';
import Search from './search';

interface RelationModalContentProps {
  fromOther?: boolean;
  chosen: Concepts[];
  setChosen: (value: Concepts[]) => void;
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
  const [searchConcept, result] = useSearchConceptMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<
    (StatusesType & SingleSelectData) | null
  >();
  const [totalResults, setTotalResults] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

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
  };

  useEffect(() => {
    if (result.isSuccess) {
      setSearchResults(result.data.concepts);
      setTotalResults(result.data.totalHitCount);
      if (!initialized) {
        setChosen(
          result.data.concepts.filter((c) =>
            initialChosenConcepts.includes(c.id)
          )
        );
        setInitialized(true);
      }
    }
  }, [
    setSearchResults,
    setTotalResults,
    setChosen,
    result,
    initialChosenConcepts,
    initialized,
  ]);

  useMountEffect(handleSearch, fromOther);

  return (
    <>
      <Search
        handleSearch={handleSearch}
        handleClearValues={handleClearValues}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setStatus={setStatus}
        status={status}
        statuses={statuses}
        totalHitCount={result.data?.totalHitCount}
      />

      <RenderConcepts
        concepts={searchResults}
        chosen={chosen}
        setChosen={setChosen}
      />

      <LocalPagination
        currentPage={currPage}
        setCurrentPage={handlePageChange}
        totalHitCount={totalResults}
        maxTotal={20}
      />
    </>
  );
}
