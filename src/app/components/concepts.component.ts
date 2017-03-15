import {Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TermedService } from '../services/termed.service';
import { Node } from '../entities/node';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container-fluid">

      <ajax-loading-indicator *ngIf="loading"></ajax-loading-indicator>

      <div [hidden]="loading">

        <div class="row">
          <div class="col-12">
            <vocabulary *ngIf="conceptScheme" [value]="conceptScheme"></vocabulary>
          </div>
        </div>
  
        <div class="bottom">
          <div class="row">
            <div class="col-lg-3">
              <ngb-tabset *ngIf="graphId">
                <ngb-tab>
                  <template ngbTabTitle>{{'Alphabetic' | translate}}</template>
                  <template ngbTabContent><concept-list [graphId]="graphId"></concept-list></template>
                </ngb-tab>
                <ngb-tab>
                  <template ngbTabTitle>{{'Hierarchical' | translate}}</template>
                  <template ngbTabContent><concept-hierarchy [graphId]="graphId"></concept-hierarchy></template>
                </ngb-tab>
              </ngb-tabset>
            </div>

            <div class="col-lg-9 selection">
              <router-outlet></router-outlet>
            </div>
          </div>
        
        </div>
      
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit {

  graphId: string;
  conceptScheme: Node<'TerminologicalVocabulary'>;
  conceptScheme$: Observable<Node<'TerminologicalVocabulary'>>;

  constructor(private route: ActivatedRoute,
              private termedService: TermedService,
              private locationService: LocationService) {
  }

  get loading() {
    return !this.conceptScheme;
  }

  ngOnInit() {

    const graphId$ = this.route.params.map(params => params['graphId'] as string);

    graphId$.subscribe(graphId => this.graphId = graphId);

    this.conceptScheme$ = graphId$.switchMap(graphId => this.termedService.getConceptScheme(graphId))
      .publishReplay()
      .refCount();

    this.conceptScheme$.subscribe(conceptScheme => {
      this.locationService.atConceptScheme(conceptScheme);
      this.conceptScheme = conceptScheme;
    });
  }
}
