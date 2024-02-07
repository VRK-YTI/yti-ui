import { Dispatch, SetStateAction } from 'react';
import { Pagination as SFPagination } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  lastPage: number;
}

export default function Pagination({
  currentPage,
  setCurrentPage,
  lastPage,
}: PaginationProps) {
  const { t } = useTranslation('common');
  return (
    <SFPagination
      aria-label={t('pagination.aria.label')}
      pageIndicatorText={(currentPage, lastPage) =>
        t('pagination.page') + ' ' + currentPage + ' / ' + lastPage
      }
      ariaPageIndicatorText={(currentPage, lastPage) =>
        t('pagination.aria.info', { currentPage, lastPage })
      }
      lastPage={lastPage}
      currentPage={currentPage}
      onChange={(page) => setCurrentPage(+page)}
      nextButtonAriaLabel={t('pagination.aria.next')}
      previousButtonAriaLabel={t('pagination.aria.prev')}
      pageInput={false}
    />
  );
}
