import { TerminologySearchResult } from '@app/common/interfaces/terminology.interface';
import { VocabularyConcepts } from '@app/common/interfaces/vocabulary.interface';
import { Collection } from '@app/common/interfaces/collection.interface';

export interface PaginationProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  isSmall?: boolean;
  pageString: string;
}
