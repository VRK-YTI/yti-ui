import { Icon } from 'suomifi-ui-components';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { PaginationButton, PaginationWrapper } from './pagination.styles';

interface PaginationProps {
  data: TerminologySearchResult;
}

export default function Pagination({ data }: PaginationProps) {
  const items = Array.from({ length: Math.ceil(data.totalHitCount / 2) },
    (_, item) => item + 1);
  let activeItem = 1;

  for (let i = 1; i <= items.length; i++) {
    if (data.resultStart === 0) {
      activeItem = 1;
      break;
    }

    if (data.resultStart == i * 2) {
      activeItem = i + 1;
      break;
    }
  };

  const handleClick = (i: number) => {
    console.log(i);
  };

  return (
    <PaginationWrapper>
      <PaginationButton>
        <Icon icon='chevronLeft' />
      </PaginationButton>

      {items.map(item => {
        return (
          <PaginationButton
            key={`pagination-item-${item}`}
            onClick={() => handleClick(item)}
            active={item === activeItem}
          >
            {item}
          </PaginationButton>
        );
      })}

      <PaginationButton>
        <Icon icon='chevronRight' />
      </PaginationButton>
    </PaginationWrapper>
  );
}
