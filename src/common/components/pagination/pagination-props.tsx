import { TerminologySearchResult } from "../../interfaces/terminology.interface";
import { VocabularyConcepts } from "../../interfaces/vocabulary.interface";
import { Collection } from "../../interfaces/collection.interface";

export interface PaginationProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  isSmall?: boolean;
  pageString: string;
}
