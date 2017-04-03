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
              <autocomplete (selected)="autocompleteChanged($event)" (found)=foundItemsChanged($event)></autocomplete>
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

      <div class="row vocabularies" *ngIf="vocabularies">

        <div class="col-md-4">
          <div class="filters">

            <div *ngFor="let filter of filters; let hideSeparator = last">

              <div class="filter">
                <span class="title">{{filter.title | translate}}</span>
                <div class="item" [class.selected]="item.selected" (click)="item.toggle()"
                     *ngFor="let item of filter.items">
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

          <div class="search-result" *ngFor="let vocabulary of filterResults" (click)="navigate(vocabulary)">
            <div class="content">
              <span class="title">{{vocabulary.label | translateValue}}</span>
              <p>{{vocabulary.description | translateValue}}</p>
            </div>
            <div class="origin">
              <span class="publisher">{{vocabulary.publisher.label | translateValue}}</span>
              <span class="group">{{vocabulary.group.label | translateValue}}</span>
              <span class="type">{{vocabulary.typeLabel | translateValue}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class VocabulariesComponent {

  vocabularies: Node<'TerminologicalVocabulary'>[];
  filterResults: Node<'TerminologicalVocabulary'>[];

  filters: Filter[];

  constructor(termedService: TermedService,
              locationService: LocationService,
              private router: Router) {

    const languages = ['fi', 'en', 'sv']; // TODO concept scheme itself will define the languages in the future

    termedService.getVocabularyList(languages).subscribe(vocabularies => {
      this.vocabularies = vocabularies;

      const recalculateResults = () => {
        this.filterResults = vocabularies.filter(node => all(this.filters, filter => filter.matches(node)));
      };

      this.filters = [
        new Filter('Vocabulary type', vocabularies, (node) => node.meta.type, (node) => node.meta.label, recalculateResults),
        new Filter('Group', vocabularies, (node) => node.group.id, (node) => node.group.label, recalculateResults),
        new Filter('Organization', vocabularies, (node) => node.publisher.id, (node) => node.publisher.label, recalculateResults)
      ];

      recalculateResults();
    });

    locationService.atFrontPage();
  }

  navigate(vocabulary: Node<'TerminologicalVocabulary'>) {
    this.router.navigate(['/concepts', vocabulary.graphId]);
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
