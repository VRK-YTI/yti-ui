export interface EditCollectionProps {
  terminologyId: string;
  collectionName: string;
  collectionInfo?: {
    collectionId: string;
    createdBy: string;
    collectionCode: string;
    collectionUri: string;
  };
}

export interface EditCollectionFormDataType {
  name: {
    lang: string;
    value: string;
  }[];
  definition: {
    lang: string;
    value: string;
  }[];
  concepts: {
    id: string;
    prefLabels: {
      [key: string]: string;
    };
  }[];
}

export interface EditCollectionPostType {
  code?: string;
  createdBy: string;
  createdDate: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  properties: {
    definition: {
      lang: string;
      regex: string;
      value: string;
    }[];
    prefLabel: {
      lang: string;
      regex: string;
      value: string;
    }[];
  };
  references: {
    broader: [];
    member: {
      id: string;
      type: {
        graph: {
          id: string;
        };
        id: string;
        uri: string;
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
