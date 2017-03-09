import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Node } from '../entities/node';
import { LocationService } from '../services/location.service';
import { TermedService } from '../services/termed.service';
import { ConceptsComponent } from './concepts.component';
import { Observable } from 'rxjs';
import { normalizeAsArray } from '../utils/array';
import { EditableService } from '../services/editable.service';

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
export class ConceptComponent implements OnInit {

  persistentConcept: Node<'Concept'>;
  concept: Node<'Concept'>;

  constructor(private route: ActivatedRoute,
              private termedService: TermedService,
              private locationService: LocationService,
              private editableService: EditableService,
              private conceptsComponent: ConceptsComponent) {

    editableService.save$.subscribe(() => {
      // TODO
      console.log('saving concept');
      this.persistentConcept = this.concept;
    });

    editableService.cancel$.subscribe(() => {
      this.concept = this.persistentConcept.clone();
    });
  }

  ngOnInit() {

    const concept$ = this.route.params.switchMap(params => this.termedService.getConcept(this.graphId, params['conceptId']));

    Observable.combineLatest(this.conceptsComponent.conceptScheme$, concept$)
      .subscribe(([conceptScheme, concept]) => {
        if (conceptScheme && concept) {
          this.locationService.atConcept(conceptScheme, concept);
          this.persistentConcept = concept;
          this.concept = concept.clone();
        }
      });
  }

  get relatedConcepts(): Node<'Concept'>[] {
    return normalizeAsArray(this.concept.references['related'].values);
  }

  get graphId() {
    return this.route.snapshot.parent.params['graphId'] as string;
  }
}
