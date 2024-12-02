export interface Counts {
  totalHitCount: number;
  counts: {
    types: { [key: string]: number };
    statuses: { [key: string]: number };
    groups: { [key: string]: number };
    languages?: { [key: string]: number };
  };
}
