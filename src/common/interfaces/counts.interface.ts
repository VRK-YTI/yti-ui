export interface Counts {
  totalHitCount: number;
  counts: {
    categories: { [key: string]: number };
    statuses: {
      'VALID': number;
      'DRAFT': number;
      'RETIRED': number;
      'SUPERSEDED': number;
    };
    groups: { [key: string]: number };
  };
}
