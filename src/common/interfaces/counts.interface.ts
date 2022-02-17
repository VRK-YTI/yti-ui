export interface Counts {
  totalHitCount: number;
  counts: {
    categories: { [key: string]: number };
    statuses: { [key: string]: number };
    groups: { [key: string]: number };
  };
}
