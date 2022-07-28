export interface EditCollectionProps {
  collectionId?: string;
  terminologyId: string;
  collectionName: string;
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
