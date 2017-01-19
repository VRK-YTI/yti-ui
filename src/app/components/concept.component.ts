import { Component, OnInit } from '@angular/core';
import { TermedService, ConceptItem } from '../services/termed.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'concept',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1>{{'Concept' | translate}}</h1>
          </div>        
        </div>
      </div>
      <div class="row" *ngIf="concept">
        <div class="col-md-12">
          <div *ngIf="concept">
            <dl>
              <dt translate>Label</dt>
              <dd>{{concept.label | translateValue}}</dd>
            </dl>
            <dl>
              <dt translate>Definition</dt>
              <dd>{{concept.definition | translateValue}}</dd>
            </dl>
            <dl>
              <dt translate>Status</dt>
              <dd>{{concept.status | translate}}</dd>
            </dl>
            <dl>
              <dt translate>Id</dt>
              <dd>{{concept.uri}}</dd>
            </dl>
            <dl>
              <dt translate>Created at</dt>
              <dd>{{concept.createdDate}}</dd>
            </dl>
            <dl>
              <dt translate>Modified at</dt>
              <dd>{{concept.lastModifiedDate}}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConceptComponent implements OnInit {

  concept: ConceptItem;

  constructor(private route: ActivatedRoute, private termedService: TermedService) {
  }

  ngOnInit() {
    this.route.params.switchMap(params => this.termedService.getConceptItem(params['graphId'], params['conceptId']))
      .subscribe(concept => this.concept = concept);
  }
}
