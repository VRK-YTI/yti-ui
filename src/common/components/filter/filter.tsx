import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import Separator from '../separator';
import SkipLink from '../skip-link/skip-link';
import {
  CloseWrapper,
  FilterContent,
  FilterWrapper,
  Header,
  HeaderButton
} from './filter.styles';
import ResetAllFiltersButton from './reset-all-filters-button';

export interface FilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  children: React.ReactNode;
}

export function Filter({
  isModal = false,
  onModalClose,
  resultCount = 0,
  children
}: FilterProps) {
  const { t } = useTranslation('common');

  return (
    <div>
      <SkipLink href="#search-results">
        {t('skip-link-search-results')}
      </SkipLink>

      <FilterWrapper isModal={isModal}>
        {renderTitle()}
        <FilterContent>
          <ResetAllFiltersButton />
          {children}
          {renderModalFooter()}
        </FilterContent>
      </FilterWrapper>
    </div>
  );

  function renderTitle() {
    if (!isModal) {
      return (
        <Header>
          {t('vocabulary-filter-filter-list')}
        </Header>
      );
    }

    return (
      <Header>
        {t('vocabulary-filter-filter-list')}
        <HeaderButton
          iconRight='close'
          onClick={onModalClose}
        >
          {t('close')}
        </HeaderButton>
      </Header>
    );
  }

  function renderModalFooter() {
    if (!isModal) {
      return;
    }

    return (
      <CloseWrapper>
        <Separator />
        <div>{t('filter-with-current', { count: resultCount })}</div>
        <div>
          <Button fullWidth onClick={onModalClose}>
            {t('close')}
          </Button>
        </div>
      </CloseWrapper>
    );
  }
}
