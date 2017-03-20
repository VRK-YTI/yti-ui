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

      <div class="page-header row">
        <div class="col-md-12 mx-auto">

          <div class="row">
            <div class="col-md-12">
              <span class="welcome" translate>Welcome to vocabulary and concept workbench</span>
              <p translate>Frontpage information</p>
            </div>          
          </div>
          
          <div class="row">
            <div class="col-md-12">
              <div class="input-group input-group-lg input-group-search">
                <input [(ngModel)]="searchConcept"
                       type="text" 
                       class="form-control" 
                       [placeholder]="'Search concept...' | translate" />
              </div>
            </div>
          </div>
          
          <div class="row" *ngIf="searchConcept" style="padding-top: 16px">
            <div class="col-md-12">
              <div class="alert alert-danger" role="alert">
                <span translate>Not implemented yet!</span>
              </div>
            </div>
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

  conceptSchemes: Observable<Node<'TerminologicalVocabulary'>[]>;
  searchConcept: string;

  constructor(private termedService: TermedService, locationService: LocationService) {
    locationService.atFrontPage();
  }

  ngOnInit() {
    const languages = ['fi', 'en', 'sv']; // TODO concept scheme itself will define the languages in the future
    this.conceptSchemes = this.termedService.getConceptSchemeList(languages);
  }
}
