import { Terminology } from './terminology.interface';

export interface SearchTerminology {
  totalHitCount: number;
  resultStart: number;
  terminologies: Terminology[];
}
