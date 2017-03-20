import { Component, OnInit } from '@angular/core';
import { TermedService } from '../services/termed.service';
import { Observable } from 'rxjs';
import { LocationService } from '../services/location.service';
import { Node } from '../entities/node';

@Component({
  selector: 'vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Vocabularies</h1>
          </div>        
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-12">
          <div class="wrapper">
            <autocomplete (selected)="autocompleteChanged($event)" (found)=foundItemsChanged($event)></autocomplete>
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
      
      <!-- this div only for debugging -->
      <div class="row">
        <div class="col-md-12">
          <div *ngIf='!!selectedValue'>
            <div><strong>Selected item:</strong></div>
            <br>
            <i>
            {{selectedValue}}
            </i>
          </div>
        </div>
      </div>
      
    </div>
  `
})

export class VocabulariesComponent implements OnInit {

  conceptSchemes: Observable<Node<'TerminologicalVocabulary'>[]>;
  selectedValue: string;

  constructor(private termedService: TermedService, locationService: LocationService) {
    locationService.atFrontPage();
  }

  ngOnInit() {
    const languages = ['fi', 'en', 'sv']; // TODO concept scheme itself will define the languages in the future
    this.conceptSchemes = this.termedService.getConceptSchemeList(languages);
  }

  autocompleteChanged(value: any) {
    console.log("AUTOCOMPLETE CHANGED");
    this.selectedValue = JSON.stringify(value);
  }

  foundItemsChanged(items: any) {
    console.log("FOUND ITEMS CHANGED ", items);
  }
}
