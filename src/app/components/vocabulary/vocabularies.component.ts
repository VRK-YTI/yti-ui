import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupNode, OrganizationNode, VocabularyNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { anyMatching } from 'yti-common-ui/utils/array';
import { matches } from 'yti-common-ui/utils/string';
import { comparingLocalizable, comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { getInformationDomainSvgIcon, getVocabularyTypeMaterialIcon } from 'yti-common-ui/utils/icons';
import { selectableStatuses, Status } from 'yti-common-ui/entities/status';
import { ConfigurationService } from '../../services/configuration.service';

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
                   [(ngModel)]="searchText"
                   placeholder="{{'Search term' | translate}}"/>
          </div>
        </div>
      </div>

      <div><span class="search-label" translate>Filter with information domain</span></div>
      <div class="row">
        <div class="col-md-4">
          <div class="information-domain-container">
            <div class="content-box">
              <!-- TODO: .id vs .idIdentifier? -->
              <div class="information-domain"
                   *ngFor="let domainAndCount of applicableInformationDomains"
                   [class.active]="isInformationDomainSelected(domainAndCount.domain)"
                   [id]="domainAndCount.domain.idIdentifier + '_domain_toggle'"
                   (click)="toggleInformationDomainSelection(domainAndCount.domain)">
                <img [src]="getInformationDomainIconSrc(domainAndCount.domain.getProperty('notation').literalValue)">
                <span class="name">{{domainAndCount.domain.label | translateValue:true}}</span>
                <span class="count">({{domainAndCount.count}})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8">

          <div class="content-box result-list-container">

            <div class="row mb-4">
              <div class="col-md-12 result-list-filter-row">

                <span class="search-label search-label-inline" translate>Filter results</span>

                <app-organization-filter-dropdown [filterSubject]="selectedOrganization$"
                                                  id="organization_filter_dropdown"
                                                  [organizations]="applicableOrganizations$"></app-organization-filter-dropdown>
                <app-status-filter-dropdown class="ml-2" [filterSubject]="selectedStatus$"
                                            id="status_filter_dropdown"
                                            [statuses]="applicableStatuses$"></app-status-filter-dropdown>
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
                    <i
                      class="material-icons {{getVocabularyTypeIconDef(vocabulary.type).colorClass}}">{{getVocabularyTypeIconDef(vocabulary.type).name}}</i>{{vocabulary.typeLabel | translateValue:true}}
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
export class VocabulariesComponent implements OnInit, OnDestroy {

  // Active filtering criteria
  searchText$ = new BehaviorSubject('');
  selectedInformationDomain$ = new BehaviorSubject<GroupNode | null>(null);
  selectedOrganization$ = new BehaviorSubject<OrganizationNode | null>(null);
  selectedStatus$ = new BehaviorSubject<Status | null>(null);

  // Source data
  vocabularies$: Observable<VocabularyNode[]>;
  informationDomains$: Observable<GroupNode[]>;
  organizations$: Observable<OrganizationNode[]>;
  statuses: Status[] = selectableStatuses;

  // Relevant filtering criteria
  applicableInformationDomains: { domain: GroupNode, count: number }[];
  applicableOrganizations$ = new BehaviorSubject<OrganizationNode[]>([]);
  applicableStatuses$ = new BehaviorSubject<Status[]>([]);

  // Filtered vocabularies
  filteredVocabularies: VocabularyNode[] = [];

  // Other generic state
  fullDescription: { [key: string]: boolean } = {};
  subscriptionsToClean: Subscription[] = [];

  // Template wrappers
  getVocabularyTypeIconDef = getVocabularyTypeMaterialIcon;
  getInformationDomainIconSrc = getInformationDomainSvgIcon;

  constructor(private authorizationManager: AuthorizationManager,
              private configurationService: ConfigurationService,
              private languageService: LanguageService,
              private translateService: TranslateService,
              private termedService: TermedService,
              private router: Router) {
  }

  get loading() {
    // TODO: Consider organizations and statuses?
    return !this.filteredVocabularies || !this.applicableInformationDomains;
  }

  get searchText() {
    return this.searchText$.getValue();
  }

  set searchText(value: string) {
    this.searchText$.next(value);
  }

  ngOnInit() {
    this.vocabularies$ = this.termedService.getVocabularyList().pipe(
      publishReplay(1),
      refCount()
    );
    this.informationDomains$ = this.termedService.getGroupList();
    this.organizations$ = this.termedService.getOrganizationList();

    // TODO: It is probably quite possibly to do all these with single looping through of vocabularies.
    // TODO: Language based sorting done on the final lists, no need to re-construct lists?
    this.subscribeFilteredVocabularies();
    this.subscribeInformationDomains();
    this.subscribeFilters();
  }

  ngOnDestroy(): void {
    this.subscriptionsToClean.forEach(s => s.unsubscribe());
  }

  isInformationDomainSelected(domain: GroupNode) {
    return this.selectedInformationDomain$.getValue() === domain;
  }

  toggleInformationDomainSelection(domain: GroupNode) {
    this.selectedInformationDomain$.next(this.isInformationDomainSelected(domain) ? null : domain);
  }

  canAddVocabulary() {
    return this.authorizationManager.canAddVocabulary();
  }

  addVocabulary() {
    this.router.navigate(['/newVocabulary']);
  }

  toggleFullDescription(graphId: string) {
    if (this.fullDescription[graphId]) {
      delete this.fullDescription[graphId];
    } else {
      this.fullDescription[graphId] = true;
    }
  }

  private subscribeFilteredVocabularies() {
    this.subscriptionsToClean.push(
      combineLatest(this.vocabularies$, this.searchText$, this.selectedInformationDomain$, this.selectedOrganization$, this.selectedStatus$, this.languageService.language$)
        .subscribe(([vocabularies, text, domain, organization, status, _language]) => {
          this.filteredVocabularies = vocabularies.filter(voc =>
            searchMatches(text, voc) &&
            informationDomainMatches(domain, voc) &&
            organizationMatches(organization, voc) &&
            statusMatches(status, voc)
          ).sort(comparingPrimitive<VocabularyNode>(voc => !voc.priority) // vocabularies having priority set first
            .andThen(comparingPrimitive<VocabularyNode>(voc => voc.priority))
            .andThen(comparingLocalizable<VocabularyNode>(this.languageService, voc => voc.label)));
        }));
  }

  private subscribeInformationDomains() {
    this.subscriptionsToClean.push(
      combineLatest(this.informationDomains$, this.vocabularies$, this.searchText$, this.selectedOrganization$, this.selectedStatus$, this.languageService.language$)
        .subscribe(([domains, vocabularies, text, organization, status, _language]) => {
          const counts: { [id: string]: number } = vocabularies.filter(voc =>
            searchMatches(text, voc) &&
            organizationMatches(organization, voc) &&
            statusMatches(status, voc))
            .reduce((countMap, voc) => {
              voc.groups.forEach(domain => countMap[domain.id] = countMap[domain.id] ? countMap[domain.id] + 1 : 1);
              return countMap;
            }, <{ [id: string]: number }> {});
          const currentlySelectedDomainId: string | undefined = (this.selectedInformationDomain$.getValue() || { id: undefined }).id;
          this.applicableInformationDomains = domains
            .map(domain => ({ domain: domain, count: counts[domain.id] || 0 }))
            .filter(obj => obj.count > 0 || obj.domain.id === currentlySelectedDomainId)
            .sort(comparingLocalizable<{ domain: GroupNode, count: number }>(this.languageService, obj => obj.domain.label));
        }));
    // Currently selected domain remains on the list even if count reaches zero. If selection is changed it should be removed, thus:
    this.subscriptionsToClean.push(this.selectedInformationDomain$.subscribe(domain => {
      if (this.applicableInformationDomains) {
        const newId: string | undefined = domain ? domain.id : undefined;
        this.applicableInformationDomains = this.applicableInformationDomains.filter(obj => obj.count > 0 || obj.domain.id === newId);
      }
    }));
  }

  private subscribeFilters() {
    if (this.configurationService.restrictFilterOptions) {
      this.subscriptionsToClean.push(
        combineLatest(this.organizations$, this.vocabularies$, this.searchText$, this.selectedInformationDomain$, this.selectedStatus$, this.selectedOrganization$)
          .subscribe(([organizations, vocabularies, text, domain, status, selectedOrg]) => {
            const counts: { [id: string]: number } = vocabularies.filter(voc =>
              searchMatches(text, voc) &&
              informationDomainMatches(domain, voc) &&
              statusMatches(status, voc)
            ).reduce((countMap, voc) => {
              voc.contributors.forEach(org => countMap[org.id] = countMap[org.id] ? countMap[org.id] + 1 : 1);
              return countMap;
            }, <{ [id: string]: number }> {});
            const currentlySelectedOrgId: string | undefined = selectedOrg ? selectedOrg.id : undefined;
            this.applicableOrganizations$.next(organizations.filter(org => counts[org.id] || org.id === currentlySelectedOrgId));
          }));
      this.subscriptionsToClean.push(
        combineLatest(this.vocabularies$, this.searchText$, this.selectedInformationDomain$, this.selectedOrganization$, this.selectedStatus$)
          .subscribe(([vocabularies, text, domain, organization, selectedStatus]) => {
            const counts: { [id: string]: number } = vocabularies.filter(voc =>
              searchMatches(text, voc) &&
              informationDomainMatches(domain, voc) &&
              organizationMatches(organization, voc)
            ).reduce((countMap, voc) => {
              countMap[voc.status] = countMap[voc.status] ? countMap[voc.status] + 1 : 1;
              return countMap;
            }, <{ [id: string]: number }> {});
            this.applicableStatuses$.next(this.statuses.filter(status => counts[status] || status === selectedStatus));
          }));
    } else {
      this.subscriptionsToClean.push(
        combineLatest(this.vocabularies$, this.organizations$)
          .subscribe(([vocabularies, organizations]) => {
            const counts: { orgCounts: { [id: string]: number }, statCounts: { [id: string]: number } } = vocabularies.reduce((counts, voc) => {
              voc.contributors.forEach(org => counts.orgCounts[org.id] = counts.orgCounts[org.id] ? counts.orgCounts[org.id] + 1 : 1);
              counts.statCounts[voc.status] = counts.statCounts[voc.status] ? counts.statCounts[voc.status] + 1 : 1;
              return counts;
            }, <{ orgCounts: { [id: string]: number }, statCounts: { [id: string]: number } }> { orgCounts: {}, statCounts: {} });
            this.applicableOrganizations$.next(organizations.filter(org => counts.orgCounts[org.id]));
            this.applicableStatuses$.next(this.statuses.filter(status => counts.statCounts[status]));
          }));
    }
  }
}

function searchMatches(condition: string, vocabulary: VocabularyNode): boolean {
  return !condition || anyMatching(vocabulary.prefLabel, attr => matches(attr.value, condition));
}

function informationDomainMatches(informationDomain: GroupNode | null, vocabulary: VocabularyNode): boolean {
  return !informationDomain || anyMatching(vocabulary.groups, domain => domain.id === informationDomain.id);
}

function organizationMatches(organization: OrganizationNode | null, vocabulary: VocabularyNode): boolean {
  return !organization || anyMatching(vocabulary.contributors, contributor => contributor.id === organization.id);
}

function statusMatches(status: Status | null, vocabulary: VocabularyNode): boolean {
  return !status || vocabulary.status === status;
}
