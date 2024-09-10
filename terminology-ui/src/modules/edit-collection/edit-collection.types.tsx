import { LocalizedValue } from '@app/common/interfaces/interfaces-v2';

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

export interface CollectionMember {
  uri: string;
  identifier: string;
  label: LocalizedValue;
}

export interface CollectionFormData {
  identifier: string;
  label: LocalizedValue;
  description: LocalizedValue;
  members: CollectionMember[];
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
    uri: string;
    identifier: string;
    label: LocalizedValue;
  }[];
}
