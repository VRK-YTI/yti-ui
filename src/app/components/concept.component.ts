import {Component, OnInit} from '@angular/core';
import { Node } from '../entities/node';
import { TermedService } from '../services/termed.service';
import { Observable } from 'rxjs';
import { normalizeAsArray } from '../utils/array';
import { EditableService } from '../services/editable.service';
import {ActivatedRoute} from "@angular/router";
import {ConceptsComponent} from "./concepts.component";
import {LocationService} from "../services/location.service";
import {ConceptSplitPanelComponent} from "./concept-split-panel.component";
import { ConceptViewModelService } from '../services/concept.view.service';

@Component({
  selector: 'concept',
  styleUrls: ['./concept.component.scss'],
  providers: [EditableService],
  template: `
    <form *ngIf="concept">

      <div class="row">
        <div class="col-md-12">
          <editable-buttons></editable-buttons>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1>{{concept.meta.label | translateValue}}</h1>
          </div>        
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div>
          
            <!-- Special handling for primary term, could be solved with mixed property/reference sorting -->
            <reference [value]="concept.references['prefLabelXl']" *ngIf="concept.references['prefLabelXl']"></reference>
            <property [value]="property" [relatedConcepts]="relatedConcepts" *ngFor="let property of concept | properties"></property>
            <reference [value]="reference" *ngFor="let reference of concept | references: ['prefLabelXl']"></reference>
            
            <dl class="row">
              <dt class="col-md-3" translate>Id</dt>
              <dd class="col-md-9">{{concept.uri}}</dd>
            </dl>
            
            <dl class="row">
              <dt class="col-md-3" translate>Created at</dt>
              <dd class="col-md-9">{{concept.createdDate | timestamp}}</dd>
            </dl>
            
            <dl class="row">
              <dt class="col-md-3" translate>Modified at</dt>
              <dd class="col-md-9">{{concept.lastModifiedDate | timestamp}}</dd>
            </dl>
            
          </div>
          <ajax-loading-indicator *ngIf="!concept"></ajax-loading-indicator>
        </div>
      </div>
      
    </form>
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

  get relatedConcepts(): Node<'Concept'>[] {
    return normalizeAsArray(this.conceptViewModel.concept.references['related'].values);
  }
}
