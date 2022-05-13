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
      labelText: t('VALID', { ns: 'common' }),
    },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('INCOMPLETE', { ns: 'common' }),
    },
    {
      name: 'DRAFT',
      uniqueItemId: 'DRAFT',
      labelText: t('DRAFT', { ns: 'common' }),
    },
    {
      name: 'RETIRED',
      uniqueItemId: 'RETIRED',
      labelText: t('RETIRED', { ns: 'common' }),
    },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('SUPERSEDED', { ns: 'common' }),
    },
    {
      name: 'INVALID',
      uniqueItemId: 'INVALID',
      labelText: t('INVALID', { ns: 'common' }),
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
    <SearchBlock>
      <div>
        <SearchInput
          labelText={t('search-term')}
          clearButtonLabel={t('clear-button-label')}
          searchButtonLabel={t('search')}
          onChange={(value) => setSearchTerm(value as string)}
          value={searchTerm}
          onSearch={() => handleSearch()}
        />
        <SingleSelect
          ariaOptionsAvailableText={t('statuses-available')}
          labelText={t('concept-status')}
          clearButtonLabel={t('clear-button-label')}
          items={statuses}
          noItemsText={t('no-statuses-available')}
          onItemSelectionChange={(e) => setStatus(e)}
          selectedItem={status ? status : undefined}
        />
      </div>
      <div>
        <Button onClick={() => handleSearch()}>{t('search')}</Button>
        <Button
          variant="secondaryNoBorder"
          icon="remove"
          onClick={() => handleClearValues()}
        >
          {t('clear-search')}
        </Button>
      </div>
      {result.isSuccess ? (
        <div>
          <Text variant="bold" smallScreen>
            {t('number-of-concepts', { amount: result.data?.totalHitCount })}
          </Text>
        </div>
      ) : null}
    </SearchBlock>
  );
}
