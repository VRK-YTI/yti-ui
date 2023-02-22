import { InternalClass } from './internal-class.interface';

export interface SearchInternalClasses {
  totalHitCount: number;
  pageSize: number;
  pageFrom: number;
  responseObjects: InternalClass[];
}
