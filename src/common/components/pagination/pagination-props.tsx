import { TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface PaginationProps {
  data: TerminologySearchResult;
  isSmall?: boolean;
  pageString: string;
}

export interface PaginationButtonProps {
  active?: boolean;
  disabled?: boolean;
}
