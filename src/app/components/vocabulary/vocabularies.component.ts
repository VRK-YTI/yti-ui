import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VocabularyNode } from '../../entities/node';
import { Localizable } from '../../entities/localization';
import { groupBy, allMatching } from '../../utils/array';
import { isDefined, requireDefined } from '../../utils/object';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-vocabularies',
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
                <span class="name">{{item.name | translateValue:false}}</span>
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
            <span class="title">{{vocabulary.label | translateValue:false}}</span>
            <p>{{vocabulary.description | translateValue:false}}</p>
          </div>
          <div class="origin">
              <span class="publisher"
                    *ngIf="vocabulary.hasPublisher()">{{vocabulary.publisher.label | translateValue:false}}</span>
            <span class="group" *ngIf="vocabulary.hasGroup()">{{vocabulary.group.label | translateValue:false}}</span>
            <span class="type">{{vocabulary.typeLabel | translateValue:false}}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VocabulariesComponent implements OnChanges {

  @Input() vocabularies: VocabularyNode[];
  filteredVocabularies: VocabularyNode[];
  vocabularyFilters: Filter[];

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnChanges() {

    const recalculateResults = () => {
      this.filteredVocabularies = this.vocabularies.filter(node => allMatching(this.vocabularyFilters, filter => filter.matches(node)));
    };

    this.vocabularyFilters = [
      new Filter('Vocabulary type', this.vocabularies, (node) => node.meta.type, (node) => node.meta.label, recalculateResults),
      new Filter('Group', this.vocabularies, (node) => node.hasGroup() ? node.group.id : null, (node) => node.group.label, recalculateResults),
      new Filter('Organization', this.vocabularies, (node) => node.hasPublisher() ? node.publisher.id : null, (node) => node.publisher.label, recalculateResults)
    ];

    recalculateResults();
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
              vocabularyNodes: VocabularyNode[],
              private idExtractor: Extractor<any>,
              nameExtractor: Extractor<Localizable>,
              onChange: () => void) {

    const nodesWithId = vocabularyNodes.filter(node => isDefined(idExtractor(node)));

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
