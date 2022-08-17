import {
  ChevronButton,
  PaginationButton,
  PaginationMobile,
  PaginationWrapper,
} from './pagination.styles';
import { PaginationProps } from './pagination-props';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import useUrlState from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';

export default function Pagination({ data, pageString }: PaginationProps) {
  const breakPoints = useBreakpoints();
  const { urlState, patchUrlState } = useUrlState();
  const { t } = useTranslation();

  let items: number[];
  if ('totalHitCount' in data) {
    items = Array.from(
      { length: Math.ceil(data.totalHitCount / 10) },
      (_, item) => item + 1
    );
  } else {
    items = Array.from(
      { length: Math.ceil(data.length / 10) },
      (_, item) => item + 1
    );
  }

  if (items.length < 2) {
    return <></>;
  }

  return (
    <PaginationWrapper id="pagination">
      <ChevronButton
        disabled={urlState.page === 1}
        onClick={() =>
          urlState.page !== 1 && patchUrlState({ page: urlState.page - 1 })
        }
        data-testid="pagination-left"
        icon="chevronLeft"
        iconProps={{ icon: 'chevronLeft' }}
        variant="secondaryNoBorder"
        aria-label={t('pagination-previous-page')}
        id="pagination-left-button"
      />

      {!breakPoints.isSmall ? (
        FormatItemsList(items, urlState.page).map((item, idx) => {
          return (
            <PaginationButton
              key={
                item !== '...'
                  ? `pagination-item-${item}`
                  : `pagination-item-${item}-${idx}`
              }
              onClick={() =>
                urlState.page !== item &&
                typeof item === 'number' &&
                patchUrlState({ page: item })
              }
              variant={item === urlState.page ? 'default' : 'secondaryNoBorder'}
              disabled={item === '...'}
              className="pagination-number-button"
            >
              {item}
            </PaginationButton>
          );
        })
      ) : (
        <PaginationMobile>
          {pageString} {urlState.page}/{items.length}
        </PaginationMobile>
      )}

      <ChevronButton
        disabled={urlState.page === items[items.length - 1]}
        onClick={() =>
          urlState.page !== items[items.length - 1] &&
          patchUrlState({ page: urlState.page + 1 })
        }
        data-testid="pagination-right"
        icon="chevronRight"
        iconProps={{ icon: 'chevronRight' }}
        variant="secondaryNoBorder"
        aria-label={t('pagination-next-page')}
        id="pagination-right-button"
      />
    </PaginationWrapper>
  );
}

function FormatItemsList(list: number[], activeItem: number) {
  const formattedList = [];
  const displayMax = 7;

  if (list.length < 10) {
    return list;
  } else {
    if (activeItem < displayMax - 1) {
      for (let i = 0; i < displayMax; i++) {
        formattedList.push(list[i]);
      }
      formattedList.push('...');
      formattedList.push(list[list.length - 1]);
    } else if (activeItem >= list.length - 4) {
      formattedList.push(list[0]);
      formattedList.push('...');
      for (let i = list.length - 7; i < list.length; i++) {
        formattedList.push(list[i]);
      }
    } else {
      formattedList.push(list[0]);
      formattedList.push('...');
      for (let i = activeItem - 3; i < activeItem + 2; i++) {
        formattedList.push(list[i]);
      }
      formattedList.push('...');
      formattedList.push(list[list.length - 1]);
    }
  }
  return formattedList;
}
