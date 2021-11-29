import { useState } from 'react';
import { useStoreDispatch, AppThunk } from '../../../store';
import { Icon } from 'suomifi-ui-components';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { PaginationButton, PaginationWrapper } from './pagination.styles';
import { useRouter } from 'next/router';

interface PaginationProps {
  data: TerminologySearchResult;
  resultStart: (resultStart: number) => AppThunk;
}

export default function Pagination({ data, resultStart }: PaginationProps) {
  const dispatch = useStoreDispatch();
  const items = Array.from({ length: Math.ceil(data.totalHitCount / 10) },
    (_, item) => item + 1);
  const [activeItem, setActiveItem] = useState<number>(1);

  const query = useRouter();

  const handleClick = (i: number) => {
    setActiveItem(i);
    dispatch(resultStart((i - 1) * 10));
    query.replace(query.route + `?page=${i}`);
  };

  if (items.length <= 1) {
    return <></>;
  }

  return (
    <PaginationWrapper>
      <PaginationButton
        disabled={activeItem === 1}
        onClick={() => activeItem !== 1 && handleClick(activeItem - 1)}
      >
        <Icon
          icon='chevronLeft'
          color={activeItem === 1 ? 'hsl(202, 7%, 67%)' : 'hsl(212, 63%, 45%)'}
        />
      </PaginationButton>

      {FormatItemsList(items, activeItem)
        .map((item, idx) => {
          return (
            <PaginationButton
              key={item !== '...' ? `pagination-item-${item}` : `pagination-item-${item}-${idx}`}
              onClick={() => (activeItem !== item && typeof item === 'number') && handleClick(item)}
              active={item === activeItem}
              disabled={item === '...'}
            >
              {item}
            </PaginationButton>
          );
        })}

      <PaginationButton
        disabled={activeItem === items[items.length - 1]}
        onClick={() => activeItem !== items[items.length - 1] && handleClick(activeItem + 1)}
      >
        <Icon
          icon='chevronRight'
          color={activeItem === items[items.length - 1] ? 'hsl(202, 7%, 67%)' : 'hsl(212, 63%, 45%)'}
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
