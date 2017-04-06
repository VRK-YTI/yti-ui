import { Component } from '@angular/core';
import { ConceptViewModelService } from '../../services/concept.view.service';

@Component({
  selector: 'no-selection',
  template: ''
})
export class NoSelectionComponent {
  constructor(conceptViewModel: ConceptViewModelService) {
    conceptViewModel.initializeConcept(null);
  }
}
