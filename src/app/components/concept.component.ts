import { Component, OnInit } from '@angular/core';
import { TermedService, ConceptItem } from '../services/termed.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'concept',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Concept</h1>
          </div>        
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div *ngIf="concept">
            <dl class="row">
              <dt class="col-md-3" translate>Label</dt>
              <dd class="col-md-9"><localized [value]="concept.label"></localized></dd>
            </dl>            
            <dl class="row">
              <dt class="col-md-3" translate>Definition</dt>
              <dd class="col-md-9"><localized [value]="concept.definition"></localized></dd>
            </dl>
            <dl class="row">
              <dt class="col-md-3" translate>Status</dt>
              <dd class="col-md-9">{{concept.status | translate}}</dd>
            </dl>
            <dl class="row">
              <dt class="col-md-3" translate>Id</dt>
              <dd class="col-md-9">{{concept.uri}}</dd>
            </dl>
            <dl class="row">
              <dt class="col-md-3" translate>Created at</dt>
              <dd class="col-md-9">{{concept.createdDate}}</dd>
            </dl>
            <dl class="row">
              <dt class="col-md-3" translate>Modified at</dt>
              <dd class="col-md-9">{{concept.lastModifiedDate}}</dd>
            </dl>
          </div>
          <ajax-loading-indicator *ngIf="!concept"></ajax-loading-indicator>
        </div>
      </div>
    </div>
  `
})
export class ConceptComponent implements OnInit {

  concept: ConceptItem;

  constructor(private route: ActivatedRoute, private termedService: TermedService, private locationService: LocationService) {
  }

  ngOnInit() {
    const conceptScheme = this.route.params.switchMap(params => this.termedService.getConceptScheme(params['graphId']));
    const concept = this.route.params.switchMap(params => this.termedService.getConceptItem(params['graphId'], params['conceptId']));

    Observable.zip(conceptScheme, concept)
      .subscribe(([conceptScheme, concept]) => {
        this.locationService.atConcept(conceptScheme, concept);
        this.concept = concept;
      });
  }
}
