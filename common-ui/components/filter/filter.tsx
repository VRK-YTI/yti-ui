import { useTranslation } from 'next-i18next';
import { Button, IconClose } from 'suomifi-ui-components';
import Separator from '../separator';
import SkipLink from '../skip-link';
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

export default function Filter({
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

      <FilterSection
        $isModal={isModal}
        aria-labelledby="filter-title"
        id="filter"
      >
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
          <h2 id="filter-title">{t('filter-list')}</h2>
        </Header>
      );
    }

    return (
      <Header>
        <h2 id="filter-title">{t('filter-list')}</h2>
        <HeaderButton iconRight={<IconClose />} onClick={onModalClose}>
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
