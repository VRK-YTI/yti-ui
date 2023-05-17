import { Concepts } from '@app/common/interfaces/concepts.interface';
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

export interface ExpanderConceptContent {
  concept: Concepts;
  terminologyId: string;
}
