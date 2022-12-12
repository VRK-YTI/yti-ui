import { DataModel } from './datamodel.interface';

export interface SearchModels {
  totalHitCount: number;
  pageSize: number;
  pageFrom: number;
  models: DataModel[];
}
