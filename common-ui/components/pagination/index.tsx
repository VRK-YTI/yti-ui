import useUrlState from '../../utils/hooks/use-url-state';
import { Pagination as DSPagination } from 'suomifi-ui-components';
import { PaginationWrapper } from './pagination.styles';
import { useBreakpoints } from '../media-query';
import { useTranslation } from 'next-i18next';

export interface PaginationProps {
  maxPages: number;
}

export default function Pagination({ maxPages }: PaginationProps) {
  const { urlState, patchUrlState } = useUrlState();
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('common');

  if (maxPages <= 1) {
    return null;
  }

  const firstShown = (urlState.page - 1) * 50 + 1;
  const lastShown = urlState.page * 50;

  return (
    <PaginationWrapper>
      <DSPagination
        aria-label=""
        ariaPageIndicatorText={(currentPage: number, lastPage: number) =>
          t('page-indicator-text', {
            currentPage: currentPage,
            lastPage: lastPage,
            firstShown: firstShown,
            lastShown: lastShown,
          })
        }
        lastPage={maxPages}
        nextButtonAriaLabel={t('next-page')}
        onChange={(e) => typeof e === 'number' && patchUrlState({ page: e })}
        pageIndicatorText={(currentPage: number, lastPage: number) =>
          `${currentPage}/${lastPage}`
        }
        previousButtonAriaLabel={t('previous-page')}
        pageInputProps={{
          buttonText: t('jump-to-page'),
          inputPlaceholderText: t('go-to'),
          invalidValueErrorText: (value) =>
            t('value-is-not-allowed', { value: value }),
          labelText: t('page-number'),
        }}
        currentPage={urlState.page}
        smallScreen={isSmall}
        pageInput={true}
      />
    </PaginationWrapper>
  );
}

export function DetachedPagination({
  currentPage,
  maxPages,
  maxTotal,
  setCurrentPage,
}: {
  currentPage: number;
  maxPages: number;
  maxTotal: number;
  setCurrentPage: (value: number) => void;
}) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('common');

  if (maxPages <= 1) {
    return null;
  }

  const firstShown = (currentPage - 1) * maxTotal + 1;
  const lastShown = currentPage * maxTotal;

  return (
    <PaginationWrapper>
      <DSPagination
        aria-label=""
        ariaPageIndicatorText={(currentPage: number, lastPage: number) =>
          t('page-indicator-text', {
            currentPage: currentPage,
            lastPage: lastPage,
            firstShown: firstShown,
            lastShown: lastShown,
          })
        }
        lastPage={maxPages}
        nextButtonAriaLabel={t('next-page')}
        onChange={(e) => typeof e === 'number' && setCurrentPage(e)}
        pageIndicatorText={(currentPage: number, lastPage: number) =>
          `${currentPage}/${lastPage}`
        }
        previousButtonAriaLabel={t('previous-page')}
        pageInputProps={{
          buttonText: t('jump-to-page'),
          inputPlaceholderText: t('go-to'),
          invalidValueErrorText: (value) =>
            t('value-is-not-allowed', { value: value }),
          labelText: t('page-number'),
        }}
        currentPage={currentPage}
        smallScreen={isSmall}
        pageInput={true}
      />
    </PaginationWrapper>
  );
}
