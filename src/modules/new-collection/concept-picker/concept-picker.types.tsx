import { Concepts } from '@app/common/interfaces/concepts.interface';

export interface PickerModalProps {
  setVisible: (value: boolean) => void;
  terminologyId: string;
  orgConcepts: Concepts[];
  setConcepts: (value: Concepts[]) => void;
}

export interface SelectedConceptProps {
  selectedConcepts: Concepts[];
  deselect: (value: string) => void;
}

export interface ExpanderConceptContent {
  concept: Concepts;
  terminologyId: string;
}
