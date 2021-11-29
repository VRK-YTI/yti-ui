import { useState } from 'react';
import { Icon } from 'suomifi-ui-components';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { PaginationButton, PaginationWrapper } from './pagination.styles';

interface PaginationProps {
  data: TerminologySearchResult;
}

export default function Pagination({ data }: PaginationProps) {
  const items = Array.from({ length: Math.ceil(data.totalHitCount / 2) },
    (_, item) => item + 1);
  const [activeItem, setActiveItem] = useState<number>(1);

  const handleClick = (i: number) => {
    setActiveItem(i);
  };

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
  let tempList = [];
  const displayMax = 7;

  if (list.length < 10) {
    return list;
  } else {
    if (activeItem < displayMax - 1) {
      for (let i = 0; i < displayMax; i++) {
        tempList.push(list[i]);
      }
      tempList.push('...');
      tempList.push(list[list.length - 1]);
    } else if (activeItem >= list.length - 4) {
      tempList.push(list[0]);
      tempList.push('...');
      for (let i = list.length - 7; i < list.length; i++) {
        tempList.push(list[i]);
      }
    } else {
      tempList.push(list[0]);
      tempList.push('...');
      for (let i = activeItem - 3; i < activeItem + 2; i++) {
        tempList.push(list[i]);
      }
      tempList.push('...');
      tempList.push(list[list.length - 1]);
    }
  }


  //tempList = list;
  return tempList;
}
