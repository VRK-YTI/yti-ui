import { Terminology } from './terminology.interface';

export interface SearchTerminology {
  pageFrom: number;
  pageSize: number;
  totalHitCount: number;
  responseObjects: Terminology[];
}
