export interface StatusCounts {
  counts: {
    concepts: StatusCountsObjects;
    terms: StatusCountsObjects;
  };
}

export interface StatusCountsObjects {
  DRAFT: number;
  SUPERSEDED: number;
  RETIRED: number;
  VALID: number;
}
