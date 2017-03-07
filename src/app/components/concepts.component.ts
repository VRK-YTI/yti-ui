import { Component, OnInit } from '@angular/core';
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
            <div class="col-lg-4">
              <concept-list *ngIf="concepts" [concepts]="concepts"></concept-list>              
            </div>
            
            <div class="col-lg-8 selection">
              <router-outlet></router-outlet>
            </div>
          </div>
        
        </div>
      
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit {

  loading = true;
  conceptScheme: Node<'TerminologicalVocabulary'>;
  concepts: Node<'Concept'>[];

  conceptScheme$: Observable<Node<'TerminologicalVocabulary'>>;

  constructor(private route: ActivatedRoute,
              private termedService: TermedService,
              private locationService: LocationService) {
  }

  ngOnInit() {

    const graphId$ = this.route.params.map(params => params['graphId'] as string);

    const concepts$ = graphId$.switchMap(graphId => this.termedService.getConceptList(graphId))
      .publishReplay()
      .refCount();

    this.conceptScheme$ = graphId$.switchMap(graphId => this.termedService.getConceptScheme(graphId))
      .publishReplay()
      .refCount();

    Observable.zip(concepts$, this.conceptScheme$).subscribe(([concepts, conceptScheme]) => {
      this.locationService.atConceptScheme(conceptScheme);
      this.conceptScheme = conceptScheme;
      this.concepts = concepts;
      this.loading = false;
    });
  }
}
