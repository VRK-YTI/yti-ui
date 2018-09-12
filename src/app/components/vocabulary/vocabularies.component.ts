import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GroupNode, OrganizationNode, VocabularyNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { anyMatching } from 'yti-common-ui/utils/array';
import { matches } from 'yti-common-ui/utils/string';
import { comparingLocalizable, comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { VocabularyNodeType } from 'app/entities/node-api';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { TranslateService } from '@ngx-translate/core';
import { getGroupSvgIcon, getVocabularyTypeMaterialIcon } from 'yti-common-ui/utils/icons';

@Component({
  selector: 'app-vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="vocabularies-container" *ngIf="!loading">

      <button class="btn btn-action float-right" id="add_vocabulary_button" *ngIf="canAddVocabulary()" (click)="addVocabulary()">
        <span translate>Add vocabulary</span>
      </button>
      
      <h4 class="tool-inner-title" translate>Controlled Vocabularies</h4>
      <div class="tool-info"><p translate>ToolInfo</p></div>

      <div><span class="search-label" translate>Search vocabularies</span></div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="input-group input-group-lg input-group-search">
            <input class="form-control"
                   id="vocabularies_search_input"
                   type="text"
                   [(ngModel)]="search"
                   placeholder="{{'Search term' | translate}}"/>
          </div>
        </div>
      </div>

      <div><span class="search-label" translate>Filter with classification</span></div>
      <div class="row">
        <div class="col-md-4">
          <div class="content-box">
            <div class="classification"
                 *ngFor="let classification of classifications"
                 [class.active]="isClassificationSelected(classification.node)"
                 [id]="classification.node.idIdentifier + '_classification_toggle'"
                 (click)="toggleClassification(classification.node)">

              <img [src]="groupIconSrc(classification.node.getProperty('notation').literalValue)">
              <span class="count">({{classification.count}})</span>
              <span class="name">{{classification.node.label | translateValue:true}}</span>
            </div>
          </div>
        </div>

        <div class="col-md-8">

          <div class="content-box result-list-container">

            <div class="row mb-4">
              <div class="col-md-12">
  
                <div class="inline-label float-left"><span class="search-label" translate>Filter results</span></div>
  
                <app-organization-filter-dropdown [filterSubject]="organization$"
                                                  id="organization_filter_dropdown"
                                                  [organizations]="organizations$"></app-organization-filter-dropdown>
                
                <app-filter-dropdown class="float-left ml-2"
                                     id="vocabulary_type_filter_dropdown"
                                     [options]="vocabularyTypes"
                                     [filterSubject]="vocabularyType$"></app-filter-dropdown>
  
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-12">
                <div>
                  {{filteredVocabularies.length}}
                  <span *ngIf="filteredVocabularies.length === 1" translate>result</span>
                  <span *ngIf="filteredVocabularies.length !== 1" translate>results</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="result-list-item" *ngFor="let vocabulary of filteredVocabularies">
                  <div class="vocabulary" [id]="vocabulary.idIdentifier + '_vocabulary_navigation'">
  
                    <span class="type"><i class="material-icons">{{vocabularyTypeIconName(vocabulary.type)}}</i>{{vocabulary.typeLabel | translateValue:true}}</span>
  
                    <app-status class="status" [status]="vocabulary.status"></app-status>

                    <a class="name" [routerLink]="['/concepts', vocabulary.graphId]">{{vocabulary.label | translateValue:true}}</a>

                    <span class="description">{{vocabulary.description | translateValue:true}}</span>

                    <span class="groups">
                      <span class="group badge badge-info" *ngFor="let group of vocabulary.groups">
                        {{group.label | translateValue:true}}
                      </span>
                    </span>

                    <ul class="organizations dot-separated-list">
                      <li class="organization" *ngFor="let contributor of vocabulary.contributors">
                        {{contributor.label | translateValue:true}}
                      </li>
                    </ul>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class VocabulariesComponent implements OnDestroy {

  search$ = new BehaviorSubject('');
  classification$ = new BehaviorSubject<GroupNode|null>(null);
  organization$ = new BehaviorSubject<OrganizationNode|null>(null);
  vocabularyType$ = new BehaviorSubject<VocabularyNodeType|null>(null);

  classifications: { node: GroupNode, count: number }[];
  organizations$: Observable<OrganizationNode[]>;
  vocabularyTypes: FilterOptions<VocabularyNodeType>;

  filteredVocabularies: VocabularyNode[] = [];

  vocabulariesLoaded = false;
  subscriptionToClean: Subscription[] = [];

  constructor(private authorizationManager: AuthorizationManager,
              languageService: LanguageService,
              translateService: TranslateService,
              termedService: TermedService,
              private router: Router) {

    const vocabularies$ = termedService.getVocabularyList().pipe(
      publishReplay(1),
      refCount(),
      tap(() => this.vocabulariesLoaded = true)
    );

    this.vocabularyTypes = [null, 'Vocabulary', 'TerminologicalVocabulary'].map(type => {
      return {
        value: type as VocabularyNodeType,
        name: () => translateService.instant(type ? type + 'Type' : 'All vocabulary types'),
        idIdentifier: () => type ? type : 'all_selected'
      }
    });

    this.organizations$ = termedService.getOrganizationList();

    function searchMatches(search: string, vocabulary: VocabularyNode) {
      return !search || anyMatching(vocabulary.prefLabel, attr => matches(attr.value, search));
    }

    function classificationMatches(classification: GroupNode|null, vocabulary: VocabularyNode) {
      return !classification || anyMatching(vocabulary.groups, group => group.id === classification.id);
    }

    function organizationMatches(organization: OrganizationNode|null, vocabulary: VocabularyNode) {
      return !organization || anyMatching(vocabulary.contributors, contributor => contributor.id === organization.id);
    }

    function vocabularyTypeMatches(vocabularyType: VocabularyNodeType|null, vocabulary: VocabularyNode) {
      return !vocabularyType || vocabulary.type === vocabularyType;
    }

    combineLatest(termedService.getGroupList(), vocabularies$, this.search$, this.organization$, this.vocabularyType$)
      .subscribe(([groups, vocabularies, search, organization, vocabularyType]) => {

        const matchingVocabularies = vocabularies.filter(vocabulary =>
          searchMatches(search, vocabulary) &&
          organizationMatches(organization, vocabulary) &&
          vocabularyTypeMatches(vocabularyType, vocabulary));

        const vocabularyCount = (classification: GroupNode) =>
          matchingVocabularies.filter(voc => classificationMatches(classification, voc)).length;

        this.classifications = groups.map(group => ({ node: group, count: vocabularyCount(group) })).filter(c => c.count > 0);
      });

    this.subscriptionToClean.push(
      combineLatest(vocabularies$, this.search$, this.classification$, this.organization$, this.vocabularyType$, languageService.language$)
        .subscribe(([vocabularies, search, classification, organization, vocabularyType]) => {

          this.filteredVocabularies =
            vocabularies.filter(vocabulary =>
              searchMatches(search, vocabulary) &&
              classificationMatches(classification, vocabulary) &&
              organizationMatches(organization, vocabulary) &&
              vocabularyTypeMatches(vocabularyType, vocabulary));

          this.filteredVocabularies.sort(
            comparingPrimitive<VocabularyNode>(voc => !voc.priority) // vocabularies having priority set first
              .andThen(comparingPrimitive<VocabularyNode>(voc => voc.priority))
              .andThen(comparingLocalizable<VocabularyNode>(languageService, voc => voc.label))
          );
        })
    );
  }

  get loading() {
    return !this.vocabulariesLoaded || !this.classifications || !this.organizations$;
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

  canAddVocabulary() {
    return this.authorizationManager.canAddVocabulary();
  }

  addVocabulary() {
    this.router.navigate(['/newVocabulary']);
  }

  ngOnDestroy(): void {
    this.subscriptionToClean.forEach(s => s.unsubscribe());
  }

  vocabularyTypeIconName = getVocabularyTypeMaterialIcon;
  groupIconSrc = getGroupSvgIcon;
}
