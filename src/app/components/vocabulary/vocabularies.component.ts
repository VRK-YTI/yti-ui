import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupNode, OrganizationNode, VocabularyNode } from '../../entities/node';
import { AuthorizationManager } from '../../services/authorization-manager.sevice';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TermedService } from '../../services/termed.service';
import { anyMatching } from '../../utils/array';
import { matches } from '../../utils/string';
import { comparingLocalizable } from '../../utils/comparator';
import { LanguageService } from '../../services/language.service';
import { VocabularyNodeType } from '../../entities/node-api';
import { FilterOptions } from '../common/filter-dropdown.component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div *ngIf="!loading">

      <div class="row">
        <div class="col-md-3 mb-3">
          <div class="input-group input-group-lg input-group-search">
            <input class="form-control"
                   type="text"
                   [(ngModel)]="search"
                   placeholder="{{'Search' | translate}}"/>
          </div>
        </div>
      </div>

      <div class="row">

        <div class="col-md-3">
          <div class="content-box">
            <h4 class="strong" translate>Classification</h4>

            <div class="classification"
                 *ngFor="let classification of classifications"
                 [class.active]="isClassificationSelected(classification.node)"
                 (click)="toggleClassification(classification.node)">

              <span class="name">{{classification.node.label | translateValue:false}}</span>
              <span class="count">({{classification.count}})</span>
            </div>
          </div>
        </div>

        <div class="col-md-9">

          <div class="row mb-4">
            <div class="col-md-12">

              <app-organization-filter-dropdown [filterSubject]="organization$" 
                                                [organizations]="organizations$"></app-organization-filter-dropdown>
              
              <app-filter-dropdown class="pull-left ml-2"
                                   [options]="vocabularyTypes"
                                   [filterSubject]="vocabularyType$"></app-filter-dropdown>


              <button class="btn btn-action pull-right" *ngIf="canAddVocabulary()" (click)="addVocabulary()">
                <i class="fa fa-plus"></i>
                <span translate>Add vocabulary</span>
              </button>
            </div>
          </div>

          <div class="content-box">

            <div class="row mb-4">
              <div class="col-md-12">
                <div>
                  <strong>{{filteredVocabularies.length}}</strong>
                  <span *ngIf="filteredVocabularies.length === 1" translate>vocabulary</span>
                  <span *ngIf="filteredVocabularies.length !== 1" translate>vocabularies</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="vocabulary" *ngFor="let vocabulary of filteredVocabularies" (click)="navigate(vocabulary)">

                  <span class="name">{{vocabulary.label | translateValue:false}}</span>

                  <span class="organization" *ngFor="let publisher of vocabulary.publishers">
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
        </div>
      </div>
    </div>
  `
})
export class VocabulariesComponent {

  vocabularies: VocabularyNode[] = [];

  search$ = new BehaviorSubject('');
  classification$ = new BehaviorSubject<GroupNode|null>(null);
  organization$ = new BehaviorSubject<OrganizationNode|null>(null);
  vocabularyType$ = new BehaviorSubject<VocabularyNodeType|null>(null);

  classifications: { node: GroupNode, count: number }[];
  organizations$: Observable<OrganizationNode[]>;
  vocabularyTypes: FilterOptions<VocabularyNodeType>;

  filteredVocabularies: VocabularyNode[] = [];

  constructor(private authorizationManager: AuthorizationManager,
              languageService: LanguageService,
              translateService: TranslateService,
              termedService: TermedService,
              private router: Router) {

    const vocabularies$ = termedService.getVocabularyList();

    vocabularies$.subscribe(vocabularies => this.vocabularies = vocabularies);

    this.vocabularyTypes = [null, 'Vocabulary', 'TerminologicalVocabulary'].map(type => {
      return {
        value: type as VocabularyNodeType,
        name: () => translateService.instant(type ? type + 'Type' : 'All vocabulary types')
      }
    });

    this.organizations$ = termedService.getOrganizationList();

    Observable.zip(termedService.getGroupList(), vocabularies$)
      .subscribe(([groups, vocabularies]) => {

        const vocabularyCount = (group: GroupNode) => {
          return vocabularies.filter(voc => anyMatching(voc.groups, vocGroup => vocGroup.id === group.id)).length;
        };

        this.classifications = groups.map(group => ({ node: group, count: vocabularyCount(group) }));
        this.classifications.sort(comparingLocalizable<{ node: GroupNode }>(languageService, c => c.node.label));
      });

    Observable.combineLatest(vocabularies$, this.search$, this.classification$, this.organization$, this.vocabularyType$)
      .subscribe(([vocabularies, search, classification, organization, vocabularyType]) => {

        this.filteredVocabularies = vocabularies.filter(vocabulary => {

          const searchMatches = !search || anyMatching(vocabulary.prefLabel, attr => matches(attr.value, search));
          const classificationMatches = !classification || anyMatching(vocabulary.groups, group => group.id === classification.id);
          const organizationMatches = !organization || anyMatching(vocabulary.publishers, publisher => publisher.id === organization.id);
          const vocabularyTypeMatches = !vocabularyType || vocabulary.type === vocabularyType;

          return searchMatches && classificationMatches && organizationMatches && vocabularyTypeMatches;
        });

        this.filteredVocabularies.sort(comparingLocalizable<VocabularyNode>(languageService, voc => voc.label));
      });
  }

  get loading() {
    return !this.vocabularies || !this.classifications || !this.organizations$;
  }

  get search() {
    return this.search$.getValue();
  }

  set search(value: string) {
    this.search$.next(value);
  }

  isClassificationSelected(classification: GroupNode) {
    return this.classification$.getValue() === classification;
  }

  toggleClassification(classification: GroupNode) {
    this.classification$.next(this.isClassificationSelected(classification) ? null : classification);
  }

  navigate(vocabulary: VocabularyNode) {
    this.router.navigate(['/concepts', vocabulary.graphId]);
  }

  canAddVocabulary() {
    return this.authorizationManager.canAddVocabulary();
  }

  addVocabulary() {
    this.router.navigate(['/newVocabulary']);
  }
}
