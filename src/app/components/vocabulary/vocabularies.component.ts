import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GroupNode, OrganizationNode, VocabularyNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TermedService } from 'app/services/termed.service';
import { anyMatching } from 'yti-common-ui/utils/array';
import { matches } from 'yti-common-ui/utils/string';
import { comparingLocalizable, comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { VocabularyNodeType } from 'app/entities/node-api';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div *ngIf="!loading">

      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="input-group input-group-lg input-group-search">
            <input class="form-control"
                   id="vocabularies_search_input"
                   type="text"
                   [(ngModel)]="search"
                   placeholder="{{'Search vocabularies' | translate}}"/>
          </div>
        </div>
      </div>

      <div class="row">

        <div class="col-md-4">
          <div class="content-box">
            <h4 class="strong" translate>Classification</h4>

            <div class="classification"
                 *ngFor="let classification of classifications"
                 [class.active]="isClassificationSelected(classification.node)"
                 [id]="classification.node.idIdentifier + '_classification_toggle'"
                 (click)="toggleClassification(classification.node)">

              <span class="name">{{classification.node.label | translateValue:true}}</span>
              <span class="count">({{classification.count}})</span>
            </div>
          </div>
        </div>

        <div class="col-md-8">

          <div class="row mb-4">
            <div class="col-md-12">

              <app-organization-filter-dropdown [filterSubject]="organization$"
                                                id="organization_filter_dropdown"
                                                [organizations]="organizations$"></app-organization-filter-dropdown>
              
              <app-filter-dropdown class="pull-left ml-2"
                                   id="vocabulary_type_filter_dropdown"
                                   [options]="vocabularyTypes"
                                   [filterSubject]="vocabularyType$"></app-filter-dropdown>


              <button class="btn btn-action pull-right" id="add_vocabulary_button" *ngIf="canAddVocabulary()" (click)="addVocabulary()">
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
                <div class="vocabulary" *ngFor="let vocabulary of filteredVocabularies" [id]="vocabulary.idIdentifier + '_vocabulary_navigation'" (click)="navigate(vocabulary)">

                  <span class="name">{{vocabulary.label | translateValue:true}}</span>

                  <span class="organization" *ngFor="let contributor of vocabulary.contributors">
                    {{contributor.label | translateValue:true}}
                  </span>

                  <span class="group" *ngFor="let group of vocabulary.groups">
                    {{group.label | translateValue:true}}
                  </span>

                  <span class="type">{{vocabulary.typeLabel | translateValue:true}}</span>

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

    const vocabularies$ = termedService.getVocabularyList().publishReplay(1).refCount()
      .do(() => this.vocabulariesLoaded = true);

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

    Observable.combineLatest(termedService.getGroupList(), vocabularies$, this.search$, this.organization$, this.vocabularyType$)
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
      Observable.combineLatest(vocabularies$, this.search$, this.classification$, this.organization$, this.vocabularyType$, languageService.language$)
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

  navigate(vocabulary: VocabularyNode) {
    this.router.navigate(['/concepts', vocabulary.graphId]);
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
}
