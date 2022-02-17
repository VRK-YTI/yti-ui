import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import Separator from '../separator';
import {
  CloseWrapper,
  FilterContent,
  FilterWrapper,
  Header,
  HeaderButton
} from './filter.styles';
import ResetAllFiltersButton from './reset-all-filters-button';

/**
 * Error handling:
 * - if groups or organizations are missing
 *   should the components that use either
 *   of the values return an indicator that
 *   needed data is missing?
 */

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
    <FilterWrapper isModal={isModal}>
      {renderTitle()}
      <FilterContent>
        <ResetAllFiltersButton />
        {children}
        {renderModalFooter()}
      </FilterContent>
    </FilterWrapper>
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
