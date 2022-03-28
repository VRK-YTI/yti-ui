import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import Separator from '@app/common/components/separator';
import SkipLink from '@app/common/components/skip-link/skip-link';
import {
  CloseWrapper,
  FilterContent,
  FilterSection,
  Header,
  HeaderButton,
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
  children,
}: FilterProps) {
  const { t } = useTranslation('common');

  return (
    <div>
      {!isModal && (
        <SkipLink href="#search-results">
          {t('skip-link-search-results')}
        </SkipLink>
      )}

      <FilterSection isModal={isModal} aria-labelledby="filter-title">
        {renderTitle()}
        <FilterContent>
          <ResetAllFiltersButton />
          {children}
          {renderModalFooter()}
        </FilterContent>
      </FilterSection>
    </div>
  );

  function renderTitle() {
    if (!isModal) {
      return (
        <Header>
          <h2 id="filter-title">{t('vocabulary-filter-filter-list')}</h2>
        </Header>
      );
    }

    return (
      <Header>
        <h2 id="filter-title">{t('vocabulary-filter-filter-list')}</h2>
        <HeaderButton iconRight="close" onClick={onModalClose}>
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
