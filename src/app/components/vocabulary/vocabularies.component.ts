import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TermedService } from '../../services/termed.service';
import { LocationService } from '../../services/location.service';
import { VocabularyNode } from '../../entities/node';
import { Localizable } from '../../entities/localization';
import { groupBy, allMatching } from '../../utils/array';
import { isDefined, requireDefined } from '../../utils/object';
import { UserService } from '../../services/user.service';
import { defaultLanguages } from '../../utils/language';

@Component({
  selector: 'vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="row add-vocabulary">
      <div class="col-md-12">
        <button class="button btn-default pull-right" *ngIf="canAddVocabulary()" (click)="addVocabulary()">
          <i class="fa fa-plus"></i>
          <span translate>Add vocabulary</span>
        </button>
      </div>
    </div>

    <div class="row vocabularies" *ngIf="vocabularies">

      <div class="col-md-4">
        <div class="filters">

          <div *ngFor="let filter of vocabularyFilters; let hideSeparator = last">

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
              <strong>{{filteredVocabularies.length}}</strong>
              <span *ngIf="filteredVocabularies.length === 1" translate>vocabulary</span>
              <span *ngIf="filteredVocabularies.length !== 1" translate>vocabularies</span>
            </div>
          </div>
        </div>

        <div class="filter-result" *ngFor="let vocabulary of filteredVocabularies" (click)="navigate(vocabulary)">
          <div class="content">
            <span class="title">{{vocabulary.label | translateValue}}</span>
            <p>{{vocabulary.description | translateValue}}</p>
          </div>
          <div class="origin">
              <span class="publisher"
                    *ngIf="vocabulary.hasPublisher()">{{vocabulary.publisher.label | translateValue}}</span>
            <span class="group" *ngIf="vocabulary.hasGroup()">{{vocabulary.group.label | translateValue}}</span>
            <span class="type">{{vocabulary.typeLabel | translateValue}}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VocabulariesComponent {

  vocabularies: VocabularyNode[];
  filteredVocabularies: VocabularyNode[];
  vocabularyFilters: Filter[];

  constructor(termedService: TermedService,
              locationService: LocationService,
              private userService: UserService,
              private router: Router) {

    termedService.getVocabularyList(defaultLanguages).subscribe(vocabularies => {
      this.vocabularies = vocabularies;

      const recalculateResults = () => {
        this.filteredVocabularies = vocabularies.filter(node => allMatching(this.vocabularyFilters, filter => filter.matches(node)));
      };

      this.vocabularyFilters = [
        new Filter('Vocabulary type', vocabularies, (node) => node.meta.type, (node) => node.meta.label, recalculateResults),
        new Filter('Group', vocabularies, (node) => node.hasGroup() ? node.group.id : null, (node) => node.group.label, recalculateResults),
        new Filter('Organization', vocabularies, (node) => node.hasPublisher() ? node.publisher.id : null, (node) => node.publisher.label, recalculateResults)
      ];

      recalculateResults();
    });

    locationService.atFrontPage();
  }

  navigate(vocabulary: VocabularyNode) {
    this.router.navigate(['/concepts', vocabulary.graphId]);
  }

  canAddVocabulary() {
    return this.userService.isLoggedIn();
  }

  addVocabulary() {
    this.router.navigate(['/newVocabulary']);
  }
}

type Extractor<T> = (node: VocabularyNode) => T;

class Filter {

  items: Item[];
  selected = new Set<any>();

  constructor(public title: string,
              nodes: VocabularyNode[],
              private idExtractor: Extractor<any>,
              nameExtractor: Extractor<Localizable>,
              onChange: () => void) {

    const nodesWithId = nodes.filter(node => isDefined(idExtractor(node)));

    this.items = Array.from(groupBy(nodesWithId, idExtractor).entries())
        .map(([id, nodes]) => new Item(this, id, nameExtractor(requireDefined(nodes[0])), nodes.length, onChange));
  }

  matches(node: VocabularyNode) {
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
