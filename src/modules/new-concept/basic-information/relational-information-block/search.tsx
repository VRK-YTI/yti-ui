import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, SearchInput, SingleSelect, Text } from 'suomifi-ui-components';
import { SearchBlock } from './relation-information-block.styles';

export default function Search({
  setSearchResults,
  terminologyId,
  fromOther,
}: any) {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [searchConcept, result] = useSearchConceptMutation();

  const statuses = [
    { name: 'VALID', uniqueItemId: 'VALID', labelText: t('VALID') },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('INCOMPLETE'),
    },
    { name: 'DRAFT', uniqueItemId: 'DRAFT', labelText: t('DRAFT') },
    { name: 'RETIRED', uniqueItemId: 'RETIRED', labelText: t('RETIRED') },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('SUPERSEDED'),
    },
    { name: 'INVALID', uniqueItemId: 'INVALID', labelText: t('INVALID') },
  ];

  useEffect(() => {
    if (result.isSuccess) {
      setSearchResults(result);
    }
  }, [setSearchResults, result]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    searchConcept({
      ...(fromOther
        ? { notInTerminologyId: terminologyId }
        : { terminologyId: terminologyId }),
      query: searchTerm,
      status: status?.uniqueItemId,
    });
  };

  const handleClearValues = () => {
    setSearchTerm('');
    setStatus('');
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
          labelText="Hakusana"
          clearButtonLabel="Tyhjennä"
          searchButtonLabel="Hae"
          onChange={(value) => setSearchTerm(value as string)}
          value={searchTerm}
          onSearch={() => handleSearch()}
        />
        <SingleSelect
          ariaOptionsAvailableText="Saatavilla"
          labelText="Käsitteen tila"
          clearButtonLabel="Tyhjennä"
          items={statuses}
          noItemsText="Ei vaihtoehtoja"
          onItemSelectionChange={(e) => setStatus(e)}
          selectedItem={status}
        />
      </div>
      <div>
        <Button onClick={() => handleSearch()}>Hae</Button>
        <Button
          variant="secondaryNoBorder"
          icon="remove"
          onClick={() => handleClearValues()}
        >
          Tyhjennä haku
        </Button>
      </div>
      {result.isSuccess ? (
        <div>
          <Text variant="bold" smallScreen>
            {result.data?.totalHitCount} käsitettä
          </Text>
        </div>
      ) : null}
    </SearchBlock>
  );
}
