import { Concepts } from '@app/common/interfaces/concepts.interface';

export interface NewCollectionProps {
  terminologyId: string;
  collectionName: string;
}

export interface NewCollectionFormDataType {
  name: {
    lang: string;
    value: string;
  }[];
  description: {
    lang: string;
    value: string;
  }[];
  concepts: Concepts[];
}
