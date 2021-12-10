import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { AppDispatch, AppThunk } from '../../../store';
import { NextRouter } from 'next/router';

export interface PaginationProps {
  data: TerminologySearchResult;
  dispatch?: AppDispatch;
  isSmall?: boolean;
  pageString: string;
  setResultStart: (resultStart: number) => AppThunk;
  query: NextRouter;
}

export interface PaginationButtonProps {
  active?: boolean;
  disabled?: boolean;
}
