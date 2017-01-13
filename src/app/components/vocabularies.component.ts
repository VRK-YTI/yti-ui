import { Component, OnInit } from '@angular/core';
import { TermedService } from '../services/termed.service';
import { Observable } from 'rxjs';
import { ConceptScheme } from '../entities/conceptScheme';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
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
              <span *ngFor="let localization of conceptScheme.properties.prefLabel; let last = last">
                {{localization.lang}}: {{localization.value}}<span *ngIf="!last">,</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  `
})
export class VocabulariesComponent implements OnInit {

  conceptSchemes: Observable<ConceptScheme[]>;

  constructor(private termedService: TermedService) {
  }

  ngOnInit() {
    this.conceptSchemes = this.termedService.getConceptSchemes();
  }
}
