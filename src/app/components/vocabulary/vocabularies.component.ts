import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GroupNode, OrganizationNode, VocabularyNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { anyMatching } from 'yti-common-ui/utils/array';
import { matches } from 'yti-common-ui/utils/string';
import { comparingLocalizable, comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { VocabularyNodeType } from 'app/entities/node-api';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { TranslateService } from '@ngx-translate/core';
import { getInformationDomainSvgIcon, getVocabularyTypeMaterialIcon } from 'yti-common-ui/utils/icons';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="yti-tool-front-page" *ngIf="!loading">

      <button class="btn btn-action float-right add-main-entity" id="add_vocabulary_button" *ngIf="canAddVocabulary()"
              (click)="addVocabulary()">
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

      <div><span class="search-label" translate>Filter with information domain</span></div>
      <div class="row">
        <div class="col-md-4">
          <div class="information-domain-container">
            <div class="content-box">
              <div class="information-domain"
                   *ngFor="let domain of informationDomains"
                   [class.active]="isInformationDomainSelected(domain.node)"
                   [id]="domain.node.idIdentifier + '_domain_toggle'"
                   (click)="toggleInformationDomain(domain.node)">

                <img [src]="informationDomainIconSrc(domain.node.getProperty('notation').literalValue)">
                <span class="name">{{domain.node.label | translateValue:true}}</span>
                <span class="count">({{domain.count}})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8">

          <div class="content-box result-list-container">

            <div class="row mb-4">
              <div class="col-md-12 result-list-filter-row">

                <span class="search-label search-label-inline" translate>Filter results</span>

                <app-organization-filter-dropdown [filterSubject]="organization$"
                                                  id="organization_filter_dropdown"
                                                  [organizations]="organizations$"></app-organization-filter-dropdown>
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
                <div class="result-list-item" *ngFor="let vocabulary of filteredVocabularies"
                     [id]="vocabulary.idIdentifier + '_vocabulary_navigation'">
                  <span class="type">
                    <i class="material-icons {{vocabularyTypeIconDef(vocabulary.type).colorClass}}">{{vocabularyTypeIconDef(vocabulary.type).name}}</i>{{vocabulary.typeLabel | translateValue:true}}
                  </span>

                  <app-status class="status" [status]="vocabulary.status"></app-status>

                  <a class="name" [routerLink]="['/concepts', vocabulary.graphId]">{{vocabulary.label | translateValue:true}}</a>

                  <div class="description-container" [ngClass]="{'expand': fullDescription[vocabulary.graphId]}">
                    <span class="description">{{vocabulary.description | translateValue:true}}</span>
                    <div class="limiter-container">
                      <div class="description-limiter" (click)="toggleFullDescription(vocabulary.graphId)"></div>
                    </div>
                  </div>

                  <span class="information-domains">
                    <span class="badge badge-light" *ngFor="let domain of vocabulary.groups">
                      {{domain.label | translateValue:true}}
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
  `
})
export class VocabulariesComponent implements OnDestroy {

  search$ = new BehaviorSubject('');
  informationDomain$ = new BehaviorSubject<GroupNode | null>(null);
  organization$ = new BehaviorSubject<OrganizationNode | null>(null);

  informationDomains: { node: GroupNode, count: number }[];
  organizations$: Observable<OrganizationNode[]>;
  vocabularyTypes: FilterOptions<VocabularyNodeType>;

  filteredVocabularies: VocabularyNode[] = [];

  vocabulariesLoaded = false;
  subscriptionToClean: Subscription[] = [];

  fullDescription: { [key: string]: boolean } = {};
  vocabularyTypeIconDef = getVocabularyTypeMaterialIcon;
  informationDomainIconSrc = getInformationDomainSvgIcon;

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

    function informationDomainMatches(informationDomain: GroupNode | null, vocabulary: VocabularyNode) {
      return !informationDomain || anyMatching(vocabulary.groups, domain => domain.id === informationDomain.id);
    }

    function organizationMatches(organization: OrganizationNode | null, vocabulary: VocabularyNode) {
      return !organization || anyMatching(vocabulary.contributors, contributor => contributor.id === organization.id);
    }

    combineLatest(termedService.getGroupList(), vocabularies$, this.search$, this.organization$)
      .subscribe(([informationDomains, vocabularies, search, organization]) => {

        const matchingVocabularies = vocabularies.filter(vocabulary =>
          searchMatches(search, vocabulary) &&
          organizationMatches(organization, vocabulary));

        const vocabularyCount = (domain: GroupNode) =>
          matchingVocabularies.filter(voc => informationDomainMatches(domain, voc)).length;

        this.informationDomains = informationDomains.map(domain => ({
          node: domain,
          count: vocabularyCount(domain)
        })).filter(c => c.count > 0);
      });

    const informationDomains$ = combineLatest(termedService.getGroupList(), languageService.language$).pipe(
      map(([domains]) => {
        domains.sort(comparingLocalizable<GroupNode>(languageService, d => d.label));
        return domains;
      })
    );

    this.subscriptionToClean.push(
      combineLatest(informationDomains$, vocabularies$, this.search$, this.organization$)
        .subscribe(([informationDomains, vocabularies, search, organization]) => {
          const matchingVocabularies = vocabularies.filter(vocabulary =>
            searchMatches(search, vocabulary) &&
            organizationMatches(organization, vocabulary));

          this.filteredVocabularies = matchingVocabularies.sort(
            comparingPrimitive<VocabularyNode>(voc => !voc.priority) // vocabularies having priority set first
              .andThen(comparingPrimitive<VocabularyNode>(voc => voc.priority))
              .andThen(comparingLocalizable<VocabularyNode>(languageService, voc => voc.label))
          ).sort(comparingLocalizable<VocabularyNode>(languageService, voc => voc.label));
        })
    );
  }

  get loading() {
    return !this.vocabulariesLoaded || !this.informationDomains || !this.organizations$;
  }

  get search() {
    return this.search$.getValue();
  }

  set search(value: string) {
    this.search$.next(value);
  }

  isInformationDomainSelected(domain: GroupNode) {
    return this.informationDomain$.getValue() === domain;
  }

  toggleInformationDomain(domain: GroupNode) {
    this.informationDomain$.next(this.isInformationDomainSelected(domain) ? null : domain);
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

  toggleFullDescription(graphId: string) {
    if (this.fullDescription[graphId]) {
      delete this.fullDescription[graphId];
    } else {
      this.fullDescription[graphId] = true;
    }
  }
}
