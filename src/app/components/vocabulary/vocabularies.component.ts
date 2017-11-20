import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VocabularyNode } from '../../entities/node';
import { Localizable } from '../../entities/localization';
import { groupBy, allMatching, flatten } from '../../utils/array';
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

            <span class="publisher" *ngFor="let publisher of vocabulary.publishers">
              {{publisher.label | translateValue:false}}
            </span>
            
            <span class="group" *ngFor="let group of vocabulary.groups">
              {{group.label | translateValue:false}}
            </span>

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
      new Filter('Vocabulary type', this.vocabularies, (node) => ([{ id: node.meta.type, value: node.meta.label}]), recalculateResults),
      new Filter('Group', this.vocabularies, (node) => node.groups.map(g => ({ id: g.id, value: g.label })), recalculateResults),
      new Filter('Organization', this.vocabularies, (node) => node.publishers.map(p => ({ id: p.id, value: p.label})), recalculateResults)
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

type Extractor = (node: VocabularyNode) => { id: any, value: Localizable }[];

class Filter {

  items: Item[];
  selectedIds = new Set<any>();

  constructor(public title: string,
              vocabularyNodes: VocabularyNode[],
              private extractor: Extractor,
              onChange: () => void) {

    this.items = Array.from(groupBy(flatten(vocabularyNodes.map(n => extractor(n))), n => n.id).entries())
      .map(([id, values]) => new Item(this, id, values[0].value, values.length, onChange));
  }

  hasAnyId(values: any[]) {
    for (const value of values) {
      if (this.selectedIds.has(value)) {
        return true;
      }
    }
    return false;
  }

  matches(node: VocabularyNode) {
    return this.selectedIds.size === 0 || this.hasAnyId(this.extractor(node).map(e => e.id));
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
    return this.filter.selectedIds.has(this.id);
  }

  deselect() {
    this.filter.selectedIds.delete(this.id);
    this.onChange();
  }

  select() {
    this.filter.selectedIds.add(this.id);
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
