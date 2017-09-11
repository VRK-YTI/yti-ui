import { Component } from '@angular/core';
import { ConceptViewModelService } from '../../services/concept.view.service';

@Component({
  selector: 'app-no-selection',
  template: '<div></div>'
})
export class NoSelectionComponent {
  constructor(conceptViewModel: ConceptViewModelService) {
    conceptViewModel.initializeConcept(null);
  }
}
