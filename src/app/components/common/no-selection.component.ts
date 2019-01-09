import { Component } from '@angular/core';
import { ConceptViewModelService } from 'app/services/concept.view.service';
import { EditingComponent } from '../../services/editable.service';

@Component({
  selector: 'app-no-selection',
  template: '<div></div>'
})
export class NoSelectionComponent implements EditingComponent {
  constructor(conceptViewModel: ConceptViewModelService) {
    conceptViewModel.initializeNoSelection(true);
  }

  isEditing(): boolean {
    return false;
  }

  cancelEditing(): void {
  }
}
