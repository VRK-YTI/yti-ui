export interface NewTerminology {
  createdBy: string;
  createdDate: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  properties: {
    contact: CommonDTO[];
    description: CommonDTO[];
    language: CommonDTO[];
    prefLabel: CommonDTO[];
    priority: CommonDTO[];
    status: CommonDTO[];
    terminologyType: CommonDTO[];
  };
  references: {
    contributor: {
      id: string;
      type: {
        graph: {
          id: string;
        };
        id: string;
      };
    }[];
    inGroup: {
      id: string;
      type: {
        graph: {
          id: string;
        };
        id: string;
      };
    }[];
  };
  referrers: {};
  type: {
    graph: {
      id: string;
    };
    id: string;
    uri: string;
  };
}

interface CommonDTO {
  lang: string;
  regex: string;
  value: string;
}
