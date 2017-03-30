import { Component } from '@angular/core';
import { EditableService } from '../services/editable.service';
import { ConceptViewModelService } from '../services/concept.view.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'concept',
  styleUrls: ['./concept.component.scss'],
  providers: [EditableService],
  template: `
    <div class="component" *ngIf="concept">
    
      <div class="component-header">
        <h3>{{persistentConcept.label | translateValue}}</h3>
      </div>
    
      <form *ngIf="concept" class="component-content">
  
        <div class="row">
          <div class="col-md-12">
            <editable-buttons></editable-buttons>
          </div>
        </div>
  
        <concept-form [concept]="concept" [conceptsProvider]="conceptsProvider" [multiColumn]="true"></concept-form>
      </form>
      
    </div>
    
    <ajax-loading-indicator *ngIf="!concept"></ajax-loading-indicator>
  `
})
export class ConceptComponent {

  constructor(private route: ActivatedRoute,
              private conceptViewModel: ConceptViewModelService,
              editableService: EditableService) {

    route.params.subscribe(params => conceptViewModel.initializeConcept(params['conceptId']));
    editableService.onSave = () => this.conceptViewModel.saveConcept();
    editableService.onCancel = () => this.conceptViewModel.resetConcept();
  }

  get conceptsProvider() {
    return () => this.conceptViewModel.allConcepts$.getValue();
  }

  get concept() {
    return this.conceptViewModel.concept;
  }

  get persistentConcept() {
    return this.conceptViewModel.persistentConcept;
  }
}
