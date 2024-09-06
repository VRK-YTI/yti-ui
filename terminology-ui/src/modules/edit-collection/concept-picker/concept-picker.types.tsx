import { EditCollectionFormDataType } from '../edit-collection.types';

export interface PickerModalProps {
  setVisible: (value: boolean) => void;
  terminologyId: string;
  orgConcepts: EditCollectionFormDataType['concepts'];
  setConcepts: (value: EditCollectionFormDataType['concepts']) => void;
}

export interface SelectedConceptProps {
  selectedConcepts: EditCollectionFormDataType['concepts'];
  deselect: (value: string) => void;
}
