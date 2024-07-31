import { useTranslation } from 'next-i18next';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import { StyledPagination } from '@app/common/components/pagination/pagination.styles';

interface PaginationProps {
  lastPage: number;
}

export default function Pagination({
  lastPage,
}: PaginationProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();
  return (
    <StyledPagination
      aria-label={t('pagination.aria.label')}
      pageIndicatorText={(currentPage, lastPage) =>
        t('pagination.page') + ' ' + currentPage + ' / ' + lastPage
      }
      ariaPageIndicatorText={(currentPage, lastPage) =>
        t('pagination.aria.info', { currentPage, lastPage })
      }
      lastPage={lastPage}
      currentPage={urlState.page}
      onChange={(e) => patchUrlState({ page: +e })}
      nextButtonAriaLabel={t('pagination.aria.next')}
      previousButtonAriaLabel={t('pagination.aria.prev')}
      pageInput={false}
    />
  );
}
