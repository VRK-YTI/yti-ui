import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, SearchInput, SingleSelect, Text } from 'suomifi-ui-components';
import { SearchBlock } from './relation-information-block.styles';
import useMountEffect from '@app/common/utils/hooks/use-mount-effect';

interface SearchProps {
  setSearchResults: (value: Concepts[]) => void;
  terminologyId: string;
  fromOther?: boolean;
}

export default function Search({
  setSearchResults,
  terminologyId,
  fromOther,
}: SearchProps) {
  const { t } = useTranslation('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<typeof statuses[0] | null>();
  const [searchConcept, result] = useSearchConceptMutation();

  const statuses = [
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

  useEffect(() => {
    if (result.isSuccess) {
      setSearchResults(result.data.concepts);
    }
  }, [setSearchResults, result]);

  const handleSearch = () => {
    searchConcept({
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
      query: searchTerm,
      status: status?.uniqueItemId,
    });
  };

  useMountEffect(handleSearch);

  const handleClearValues = () => {
    setSearchTerm('');
    setStatus(null);
    searchConcept({
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
    });
  };

  return (
    <SearchBlock id="search-block">
      <div>
        <SearchInput
          labelText={t('search-term')}
          clearButtonLabel={t('clear-button-label')}
          searchButtonLabel={t('search')}
          onChange={(value) => setSearchTerm(value as string)}
          value={searchTerm}
          onSearch={() => handleSearch()}
          id="keyword-input"
        />
        <SingleSelect
          ariaOptionsAvailableText={t('statuses-available')}
          labelText={t('concept-status')}
          clearButtonLabel={t('clear-button-label')}
          items={statuses}
          noItemsText={t('no-statuses-available')}
          onItemSelectionChange={(e) => setStatus(e)}
          selectedItem={status ? status : undefined}
          id="status-picker"
        />
      </div>
      <div>
        <Button onClick={() => handleSearch()} id="search-button">
          {t('search')}
        </Button>
        <Button
          variant="secondaryNoBorder"
          icon="remove"
          onClick={() => handleClearValues()}
          id="clear-search-button"
        >
          {t('clear-search')}
        </Button>
      </div>
      {result.isSuccess ? (
        <div id="search-result-counts">
          <Text variant="bold" smallScreen>
            {t('number-of-concepts', { count: result.data?.totalHitCount })}
          </Text>
        </div>
      ) : null}
    </SearchBlock>
  );
}
