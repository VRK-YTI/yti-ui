export interface DataTypeResults {
  found: number;
  page: number;
  hits: [{document: DataType}];
}

export interface DataType {
  id: string;
  name: string;
  description: string;
  origin: string;
  // Todo: remove unnecessary when real data possible
  [key: string]: any;
}
