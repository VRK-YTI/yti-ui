import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Node } from '../entities/node';
import { LocationService } from '../services/location.service';
import { TermedService } from '../services/termed.service';
import { ConceptsComponent } from './concepts.component';
import { Observable } from 'rxjs';
import { normalizeAsArray } from '../utils/array';

@Component({
  selector: 'concept',
  styleUrls: ['./concept.component.scss'],
  template: `
    <div *ngIf="concept">

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
    </div>
  `
})
export class ConceptComponent implements OnInit {

  concept: Node<'Concept'>;

  constructor(private route: ActivatedRoute,
              private termedService: TermedService,
              private locationService: LocationService,
              private conceptsComponent: ConceptsComponent) {
  }

  get relatedConcepts(): Node<'Concept'>[] {
    return normalizeAsArray(this.concept.references['related'].values);
  }

  get graphId() {
    return this.route.snapshot.parent.params['graphId'] as string;
  }

  ngOnInit() {

    const concept$ = this.route.params.switchMap(params => this.termedService.getConcept(this.graphId, params['conceptId']));

    Observable.combineLatest(this.conceptsComponent.conceptScheme$, concept$)
      .subscribe(([conceptScheme, concept]) => {
        if (conceptScheme && concept) {
          this.locationService.atConcept(conceptScheme, concept);
          this.concept = concept;
        }
      });
  }
}
