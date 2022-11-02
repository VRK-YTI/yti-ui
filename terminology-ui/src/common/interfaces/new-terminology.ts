export interface NewTerminology {
  code?: string;
  createdBy: string;
  createdDate: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  properties: {
    contact: CommonDTO[];
    description: CommonDTO[];
    language: CommonDTO[];
    origin?: CommonDTO[];
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
        uri?: string;
      };
    }[];
    inGroup: {
      id: string;
      type: {
        graph: {
          id: string;
        };
        id: string;
        uri?: string;
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
  uri?: string;
}

interface CommonDTO {
  lang: string;
  regex: string;
  value: string;
}
