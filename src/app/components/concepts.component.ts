import { Component, OnInit } from '@angular/core';
import { TermedService, ConceptListItem } from '../services/termed.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Concepts</h1>
          </div>        
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <ul *ngIf="concepts">
            <li *ngFor="let concept of concepts">
              <a [routerLink]="['concept', concept.id]">
                {{concept.label | translateValue}}
              </a>
            </li>
          </ul>
          <ajax-loading-indicator *ngIf="!concepts"></ajax-loading-indicator>
        </div>
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit {

  concepts: ConceptListItem[];

  constructor(private route: ActivatedRoute, private termedService: TermedService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.route.params.switchMap(params => this.termedService.getConceptScheme(params['graphId']))
      .subscribe(scheme => this.locationService.atConceptScheme(scheme));

    this.route.params.switchMap(params => this.termedService.getConceptListItems(params['graphId']))
      .subscribe(concepts => this.concepts = concepts);
  }
}
