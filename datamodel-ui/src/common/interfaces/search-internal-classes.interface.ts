import { InternalClass, InternalClassInfo } from './internal-class.interface';

export interface SearchInternalClasses {
  totalHitCount: number;
  responseObjects: InternalClass[];
}

export interface SearchInternalClassesInfo {
  totalHitCount: number;
  responseObjects: InternalClassInfo[];
}
