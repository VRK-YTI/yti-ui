import { Icon } from 'suomifi-ui-components';
import { PaginationButton, PaginationMobile, PaginationWrapper } from './pagination.styles';
import { PaginationProps } from './pagination-props';
import { useBreakpoints } from '../media-query/media-query-context';
import useUrlState from '../../utils/hooks/useUrlState';

export default function Pagination({
  data,
  pageString,
}: PaginationProps) {
  const breakPoints = useBreakpoints();
  const { urlState, patchUrlState } = useUrlState();

  let items: number[];
  if ('totalHitCount' in data) {
    items = Array.from({ length: Math.ceil(data.totalHitCount / 10) }, (_, item) => item + 1);
  } else {
    items = Array.from({ length: Math.ceil(data.length / 10) }, (_, item) => item + 1);
  }

  if (items.length < 2) {
    return <></>;
  }

  return (
    <PaginationWrapper>
      <PaginationButton
        disabled={urlState.page === 1}
        onClick={() => urlState.page !== 1 && patchUrlState({ page: urlState.page - 1 })}
        data-testid='pagination-left'
      >
        {/* TODO: Update color after release in design system*/}
        <Icon
          icon='chevronLeft'
          color={urlState.page === 1 ? 'hsl(202, 7%, 67%)' : 'hsl(212, 63%, 45%)'}
        />
      </PaginationButton>

      {!breakPoints.isSmall
        ?
        FormatItemsList(items, urlState.page)
          .map((item, idx) => {
            return (
              <PaginationButton
                key={item !== '...' ? `pagination-item-${item}` : `pagination-item-${item}-${idx}`}
                onClick={() => (urlState.page !== item && typeof item === 'number') && patchUrlState({ page: item })}
                active={item === urlState.page}
                disabled={item === '...'}
              >
                {item}
              </PaginationButton>
            );
          })
        :
        <PaginationMobile>{pageString} {urlState.page}/{items.length}</PaginationMobile>
      }

      <PaginationButton
        disabled={urlState.page === items[items.length - 1]}
        onClick={() => urlState.page !== items[items.length - 1] && patchUrlState({ page: urlState.page + 1 })}
        data-testid='pagination-right'
      >
        {/* TODO: Update color*/}
        <Icon
          icon='chevronRight'
          color={urlState.page === items[items.length - 1] ? 'hsl(202, 7%, 67%)' : 'hsl(212, 63%, 45%)'}
        />
      </PaginationButton>
    </PaginationWrapper>
  );
}

function FormatItemsList(list: number[], activeItem: number) {
  let formattedList = [];
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
