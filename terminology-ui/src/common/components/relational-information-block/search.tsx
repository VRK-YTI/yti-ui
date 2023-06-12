import { useTranslation } from 'next-i18next';
import {
  Button,
  IconRemove,
  SearchInput,
  SingleSelect,
  SingleSelectData,
  Text,
} from 'suomifi-ui-components';
import { SearchBlock } from './relation-information-block.styles';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { StatusesType } from './relational-modal-content';

interface SearchProps {
  handleSearch: () => void;
  handleClearValues: () => void;
  setSearchTerm: (value: string) => void;
  searchTerm: string;
  setStatus: (value: (StatusesType & SingleSelectData) | null) => void;
  status?: StatusesType | null;
  statuses: StatusesType[];
  totalHitCount?: number;
}

export default function Search({
  handleSearch,
  handleClearValues,
  setSearchTerm,
  searchTerm,
  setStatus,
  status,
  statuses,
  totalHitCount,
}: SearchProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();

  return (
    <SearchBlock id="search-block" $isSmall={isSmall}>
      <div>
        {/*
         * This component has both onSearch and onKeyPressDownCapture intentionally.
         *
         * onSearch does not call handleSearch() when text value is empty so
         * onKeyPressCapture handles these situations
         */}
        <SearchInput
          labelText={t('search-term')}
          clearButtonLabel={t('clear-button-label')}
          searchButtonLabel={t('search')}
          onChange={(value) => setSearchTerm(value as string)}
          value={searchTerm}
          onKeyPressCapture={(e) => {
            const inputValue = e.target as HTMLInputElement;
            if (inputValue.value === '' && e.key === 'Enter') {
              handleSearch();
            }
          }}
          onSearch={() => handleSearch()}
          maxLength={TEXT_INPUT_MAX}
          id="keyword-input"
        />
        <SingleSelect
          ariaOptionsAvailableText={t('statuses-available') as string}
          labelText={t('concept-status')}
          clearButtonLabel={t('clear-button-label')}
          items={statuses}
          itemAdditionHelpText={''}
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
          icon={<IconRemove />}
          onClick={() => handleClearValues()}
          id="clear-search-button"
        >
          {t('clear-search')}
        </Button>
      </div>
      {totalHitCount ? (
        <div id="search-result-counts">
          <Text variant="bold" smallScreen>
            {t('number-of-concepts', { count: totalHitCount })}
          </Text>
        </div>
      ) : null}
    </SearchBlock>
  );
}
