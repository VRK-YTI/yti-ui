import { Component } from '@angular/core';
import { Node } from '../entities/node';
import { normalizeAsArray } from '../utils/array';
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
  
        <div class="row">
          <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
          <reference class="col-md-12" [value]="concept.references['prefLabelXl']" *ngIf="concept.references['prefLabelXl']"></reference>
          <property class="col-md-12 col-xl-6" [value]="property" [relatedConcepts]="relatedConcepts" *ngFor="let property of concept | properties: showEmpty"></property>
          <reference class="col-md-12 col-xl-6" [value]="reference" *ngFor="let reference of concept | references: showEmpty : ['prefLabelXl']"></reference>
        </div>
        
        <meta-information [node]="concept"></meta-information>
      </form>
      
    </div>
    
    <ajax-loading-indicator *ngIf="!concept"></ajax-loading-indicator>
  `
})
export class ConceptComponent {

  constructor(private route: ActivatedRoute,
              private conceptViewModel: ConceptViewModelService,
              private editableService: EditableService) {

    route.params.subscribe(params => conceptViewModel.initializeConcept(params['conceptId']));
    editableService.save$.subscribe(() => this.conceptViewModel.saveConcept());
    editableService.cancel$.subscribe(() => this.conceptViewModel.resetConcept());
  }

  get concept() {
    return this.conceptViewModel.concept;
  }

  get persistentConcept() {
    return this.conceptViewModel.persistentConcept;
  }

  get relatedConcepts(): Node<'Concept'>[] {
    return [
      ...normalizeAsArray(this.conceptViewModel.concept.references['related'].values),
      ...normalizeAsArray(this.conceptViewModel.concept.references['broader'].values)
    ];
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
