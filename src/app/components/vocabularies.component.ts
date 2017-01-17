import { Component, OnInit } from '@angular/core';
import { TermedService, ConceptSchemeListItem } from '../services/termed.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Vocabularies</h1>
          </div>        
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <ul>
            <li *ngFor="let conceptScheme of conceptSchemes | async">
              <a [routerLink]="['/concepts', conceptScheme.graphId]">
                {{conceptScheme.label | translateValue}}
              </a>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  `
})
export class VocabulariesComponent implements OnInit {

  conceptSchemes: Observable<ConceptSchemeListItem[]>;

  constructor(private termedService: TermedService) {
  }

  ngOnInit() {
    this.conceptSchemes = this.termedService.getConceptSchemeListItems();
  }
}
