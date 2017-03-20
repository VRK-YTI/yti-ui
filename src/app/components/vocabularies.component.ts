import { Component } from '@angular/core';
import { TermedService } from '../services/termed.service';
import { LocationService } from '../services/location.service';
import { Node } from '../entities/node';
import { Router } from '@angular/router';
import { Localizable } from '../entities/localization';
import { groupBy, all } from '../utils/array';
import { requireDefined } from '../utils/object';

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
          
      <div class="row vocabularies" *ngIf="conceptSchemes">
        
        <div class="col-md-4">
          <div class="filters">
          
            <div *ngFor="let filter of filters; let hideSeparator = last">
              
              <div class="filter">
                <span class="title">{{filter.title | translate}}</span>
                <div class="item" [class.selected]="item.selected" (click)="item.toggle()" *ngFor="let item of filter.items">
                  <span class="name">{{item.name | translateValue}}</span>
                  <span class="count">({{item.count}})</span>
                </div>
              </div>
              
              <div [hidden]="hideSeparator" class="separator"></div>
            </div>
            
          </div>
        </div>
        
        <div class="col-md-8">
            
          <div class="row">
            <div class="col-md-12">
              <div class="amount">
                <strong>{{filterResults.length}}</strong> 
                <span *ngIf="filterResults.length === 1" translate>vocabulary</span>
                <span *ngIf="filterResults.length !== 1" translate>vocabularies</span>
              </div>
            </div>
          </div>
                  
          <div class="search-result" *ngFor="let conceptScheme of filterResults" (click)="navigate(conceptScheme)">
            <div class="content">
              <span class="title">{{conceptScheme.label | translateValue}}</span>
              <p>{{conceptScheme.description | translateValue}}</p>
            </div>
            <div class="origin">
              <span class="publisher">{{conceptScheme.publisher.label | translateValue}}</span>
              <span class="group">{{conceptScheme.group.label | translateValue}}</span>
              <span class="type">{{conceptScheme.typeLabel | translateValue}}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class VocabulariesComponent {

  conceptSchemes: Node<'TerminologicalVocabulary'>[];
  filterResults: Node<'TerminologicalVocabulary'>[];

  searchConcept: string;
  filters: Filter[];

  constructor(termedService: TermedService,
              locationService: LocationService,
              private router: Router) {

    const languages = ['fi', 'en', 'sv']; // TODO concept scheme itself will define the languages in the future

    termedService.getConceptSchemeList(languages).subscribe(conceptSchemes => {
      this.conceptSchemes = conceptSchemes;

      const recalculateResults = () => {
        this.filterResults = conceptSchemes.filter(node => all(this.filters, filter => filter.matches(node)));
      };

      this.filters = [
        new Filter('Vocabulary type', conceptSchemes, (node) => node.meta.type, (node) => node.meta.label, recalculateResults),
        new Filter('Group', conceptSchemes, (node) => node.group.id, (node) => node.group.label, recalculateResults),
        new Filter('Organization', conceptSchemes, (node) => node.publisher.id, (node) => node.publisher.label, recalculateResults)
      ];

      recalculateResults();
    });

    locationService.atFrontPage();
  }

  navigate(conceptScheme: Node<'TerminologicalVocabulary'>) {
    this.router.navigate(['/concepts', conceptScheme.graphId]);
  }
}

type Extractor<T> = (node: Node<any>) => T;

class Filter {

  items: Item[];
  selected = new Set<any>();

  constructor(public title: string,
              nodes: Node<any>[],
              private idExtractor: Extractor<any>,
              nameExtractor: Extractor<Localizable>,
              onChange: () => void) {

    this.items = Array.from(groupBy(nodes, idExtractor).entries())
      .map(([id, nodes]) => new Item(this, id, nameExtractor(requireDefined(nodes[0])), nodes.length, onChange));
  }

  matches(node: Node<any>) {
    return this.selected.size === 0 || this.selected.has(this.idExtractor(node));
  }
}

class Item {

  constructor(private filter: Filter,
              private id: any,
              public name: Localizable,
              public count: number,
              private onChange: () => void) {
  }

  get selected() {
    return this.filter.selected.has(this.id);
  }

  deselect() {
    this.filter.selected.delete(this.id);
    this.onChange();
  }

  select() {
    this.filter.selected.add(this.id);
    this.onChange();
  }

  toggle() {
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }
}
