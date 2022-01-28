import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { AppDispatch, AppThunk } from '../../../store';
import { NextRouter } from 'next/router';
import { VocabularyConcepts } from '../../interfaces/vocabulary.interface';
import { Collection } from '../../interfaces/collection.interface';

export interface PaginationProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  dispatch: AppDispatch;
  isSmall?: boolean;
  pageString: string;
  setResultStart: (resultStart: number) => AppThunk;
  query: NextRouter;
}

export interface PaginationButtonProps {
  active?: boolean;
  disabled?: boolean;
}
