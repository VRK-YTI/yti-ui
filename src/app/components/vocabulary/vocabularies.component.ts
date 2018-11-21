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
                    <i class="material-icons {{getVocabularyTypeIconDef(vocabulary.type).colorClass}}">{{getVocabularyTypeIconDef(vocabulary.type).name}}</i>{{vocabulary.typeLabel | translateValue:true}}
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
  applicableInformationDomains: { domain: GroupNode, count: number }[] = [];
  applicableOrganizations$ = new BehaviorSubject<OrganizationNode[]>([]);
  applicableStatuses$ = new BehaviorSubject<Status[]>([]);

  // Filtered vocabularies
  filteredVocabularies: VocabularyNode[] = [];

  // Other generic state
  loading: boolean = true;
  fullDescription: { [key: string]: boolean } = {};
  subscriptionsToClean: Subscription[] = [];

  // Template wrappers
  getVocabularyTypeIconDef = getVocabularyTypeMaterialIcon;
  getInformationDomainIconSrc = getInformationDomainSvgIcon;

  // Comparators
  private vocabularyComparator =
    comparingPrimitive<VocabularyNode>(voc => !voc.priority)
      .andThen(comparingPrimitive<VocabularyNode>(voc => voc.priority))
      .andThen(comparingLocalizable<VocabularyNode>(this.languageService, voc => voc.label));
  private informationDomainComparator =
    comparingLocalizable<{ domain: GroupNode, count: number }>(this.languageService, obj => obj.domain.label);

  constructor(private authorizationManager: AuthorizationManager,
              private configurationService: ConfigurationService,
              private languageService: LanguageService,
              private translateService: TranslateService,
              private termedService: TermedService,
              private router: Router) {
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
    this.organizations$ = this.termedService.getOrganizationList().pipe(
      publishReplay(1),
      refCount()
    );

    this.makeSubscriptions();
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

  private makeSubscriptions() {
    const restrict = this.configurationService.restrictFilterOptions;
    this.subscriptionsToClean.push(
      this.languageService.language$.subscribe(_language => {
        // NOTE: Organization filter contains internal sorting. Statuses are in natural order.
        this.filteredVocabularies.sort(this.vocabularyComparator);
        this.applicableInformationDomains.sort(this.informationDomainComparator);
      })
    );
    if (!restrict) {
      // If drop down filter options are not restricted then do not regenerate sets on selection changes.
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
          })
      );
    }
    this.subscriptionsToClean.push(
      combineLatest(
        combineLatest(this.vocabularies$, this.informationDomains$, this.organizations$),
        combineLatest(this.searchText$, this.selectedInformationDomain$, this.selectedOrganization$, this.selectedStatus$))
        .subscribe(([[vocabularies, domains, organizations], [selectedText, selectedDomain, selectedOrganization, selectedStatus]]) => {
          const accumulated: FilterConstructionState = vocabularies.reduce((state, voc) => {
            const searchMatch = searchMatches(selectedText, voc);
            const domainMatch = informationDomainMatches(selectedDomain, voc);
            const orgMatch = organizationMatches(selectedOrganization, voc);
            const statusMatch = statusMatches(selectedStatus, voc);
            if (searchMatch) {
              if (domainMatch && orgMatch && statusMatch) {
                state.passedVocabularies.push(voc);
              }
              if (orgMatch && statusMatch) {
                voc.groups.forEach(domain => state.domainCounts[domain.id] = state.domainCounts[domain.id] ? state.domainCounts[domain.id] + 1 : 1);
              }
              if (restrict) {
                if (statusMatch) {
                  voc.contributors.forEach(org => state.orgCounts[org.id] = state.orgCounts[org.id] ? state.orgCounts[org.id] + 1 : 1);
                }
                if (orgMatch) {
                  state.statusCounts[voc.status] = state.statusCounts[voc.status] ? state.statusCounts[voc.status] + 1 : 1;
                }
              }
            }
            return state;
          }, <FilterConstructionState>{ passedVocabularies: [], domainCounts: {}, orgCounts: {}, statusCounts: {} });

          this.filteredVocabularies = accumulated.passedVocabularies.sort(this.vocabularyComparator);

          const currentlySelectedDomainId: string | undefined = selectedDomain ? selectedDomain.id : undefined;
          this.applicableInformationDomains = domains
            .map(domain => ({ domain: domain, count: accumulated.domainCounts[domain.id] || 0 }))
            .filter(obj => obj.count > 0 || obj.domain.id === currentlySelectedDomainId)
            .sort(this.informationDomainComparator);

          if (restrict) {
            const currentlySelectedOrgId: string | undefined = selectedOrganization ? selectedOrganization.id : undefined;
            this.applicableOrganizations$.next(organizations.filter(org => accumulated.orgCounts[org.id] || org.id === currentlySelectedOrgId));
            this.applicableStatuses$.next(this.statuses.filter(status => accumulated.statusCounts[status] || status === selectedStatus));
          }

          if (this.loading) {
            this.loading = false;
          }
        })
    );
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

type FilterConstructionState = {
  passedVocabularies: VocabularyNode[];
  domainCounts: { [id: string]: number };
  orgCounts: { [id: string]: number };
  statusCounts: { [status: string]: number };
};
