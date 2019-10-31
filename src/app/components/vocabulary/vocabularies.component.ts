import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupNode, OrganizationNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { BehaviorSubject, combineLatest, concat, Observable, Subscription } from 'rxjs';
import { debounceTime, publishReplay, refCount, skip, take } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { anyMatching } from 'yti-common-ui/utils/array';
import { comparingLocalizable } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { getInformationDomainSvgIcon, getVocabularyTypeMaterialIcon } from 'yti-common-ui/utils/icons';
import { selectableStatuses, Status } from 'yti-common-ui/entities/status';
import { ConfigurationService } from '../../services/configuration.service';
import { ElasticSearchService } from '../../services/elasticsearch.service';
import { DeepSearchHitList, Terminology, TerminologySearchRequest, TerminologySearchResponse } from '../../entities/search';
import { Localizable } from 'yti-common-ui/types/localization';
import { User, UserService } from 'yti-common-ui/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vocabularies',
  styleUrls: ['./vocabularies.component.scss'],
  template: `
    <div class="yti-tool-front-page" *ngIf="!loading">

      <button class="btn btn-action float-right add-main-entity" id="add_vocabulary_button" *ngIf="canAddVocabulary()"
              (click)="addVocabulary()">
        <span translate>Add vocabulary</span>
      </button>

      <h4 class="tool-inner-title" translate>Terminologies</h4>
      <div class="tool-info"><p translate>ToolInfo</p></div>

      <div><span class="search-label" translate>Search vocabularies</span></div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="input-group input-group-lg input-group-search">
            <input class="form-control"
                   [ngClass]="{'is-invalid': terminologySearchError}"
                   id="vocabularies_search_input"
                   type="text"
                   [(ngModel)]="searchText"
                   placeholder="{{'Search term' | translate}}"/>
          </div>
        </div>
        <div class="col-md-6 mb-3 align-self-center d-flex align-items-center extend-search-selections">
          <span translate>Extend search</span>:
          <input class="ml-3" id="search_concepts_checkbox" type="checkbox" [(ngModel)]="searchConcepts"/>
          <label class="ml-1" for="search_concepts_checkbox" translate>to concepts</label>
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

                <span class="search-label search-label-inline with-info" translate>Filter results</span>

                <div class="result-list-filter-dropdowns">
                  <app-organization-filter-dropdown [filterSubject]="selectedOrganization$"
                                                    id="organization_filter_dropdown"
                                                    [organizations]="applicableOrganizations$"></app-organization-filter-dropdown>
                  <app-status-filter-dropdown [filterSubject]="selectedStatus$"
                                              id="status_filter_dropdown"
                                              [statuses]="applicableStatuses$"></app-status-filter-dropdown>
                </div>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-md-12">
                <div>
                  {{filteredTerminologies.length}}
                  <span *ngIf="filteredTerminologies.length === 1" translate>result</span>
                  <span *ngIf="filteredTerminologies.length !== 1" translate>results</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="result-list-item" *ngFor="let terminology of filteredTerminologies"
                     [id]="terminology.uri + '_terminology_navigation'">
                  <span class="type">
                    <i
                      class="material-icons {{getTerminologyTypeIconDef('TerminologicalVocabulary').colorClass}}">{{getTerminologyTypeIconDef('TerminologicalVocabulary').name}}</i>{{'TerminologicalVocabularyType' | translate}}
                  </span>

                  <app-status class="status" [status]="terminology.status"></app-status>

                  <a class="name" [routerLink]="['/concepts', terminology.id]" [innerHTML]="terminology.label | translateValue:true"></a>

                  <div class="meta-information-row">
                    <ul class="organizations dot-separated-list">
                      <li class="organization" *ngFor="let contributor of terminology.contributors">
                        {{contributor.label | translateValue:true}}
                      </li>
                    </ul>

                    <span class="information-domains">
                      <span class="badge badge-light" *ngFor="let domain of terminology.informationDomains">
                        {{domain.label | translateValue:true}}
                      </span>
                    </span>
                  </div>

                  <div *ngIf="terminology.description | translateValue:true as descriptionText" class="description-component-container" [ngClass]="{'nrr': noRightMargin}">
                    <app-expandable-text [text]="descriptionText"></app-expandable-text>
                  </div>

                  <div *ngIf="filteredDeepHits[terminology.id] as deepHitLists" class="deep-results">
                    <div class="deep-results-title" translate>Search results</div>
                    <div *ngFor="let deepHitList of deepHitLists" class="deep-results-section">
                      <div class="deep-results-section-title" translate>Deep {{deepHitList.type}} hit</div>
                      <div class="deep-results-section-content">
                        <a *ngFor="let deepHit of deepHitList.topHits" class="deep-results-hit"
                           [routerLink]="['/concepts', terminology.id, 'concept', deepHit.id]" title="{{allLanguagesLabel(deepHit.label)}}"
                           [queryParams]="{'q': searchText}"
                           [innerHTML]="deepHit.label | translateValue:true"></a>
                        <a *ngIf="deepHitList.totalHitCount > deepHitList.topHits.length" class="deep-results-show-all"
                           [routerLink]="['/concepts', terminology.id]"
                           [queryParams]="{'q': searchText}">({{'See all results' | translate : {count: deepHitList.totalHitCount} }})</a>
                      </div>
                    </div>
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
export class VocabulariesComponent implements OnInit, OnDestroy {

  // Active filtering criteria
  searchText$ = new BehaviorSubject('');
  searchConcepts$ = new BehaviorSubject(true);
  selectedInformationDomain$ = new BehaviorSubject<GroupNode | null>(null);
  selectedOrganization$ = new BehaviorSubject<OrganizationNode | null>(null);
  selectedStatus$ = new BehaviorSubject<Status | null>(null);

  // Source data
  informationDomains$: Observable<GroupNode[]>;
  organizations$: Observable<OrganizationNode[]>;
  statuses: Status[] = selectableStatuses;

  // Search text filtered (and deep search augmented) terminology list
  // TODO: Using results here is not infinite scrolling ready, should use expanding list on service side with "fetch more".
  terminologyResults$ = new BehaviorSubject<TerminologySearchResponse>({
    totalHitCount: 0, resultStart: 0, terminologies: [], deepHits: {}
  });
  terminologySearchError: boolean = false;

  // Relevant filtering criteria
  applicableInformationDomains: { domain: GroupNode, count: number }[] = [];
  applicableOrganizations$ = new BehaviorSubject<OrganizationNode[]>([]);
  applicableStatuses$ = new BehaviorSubject<Status[]>([]);

  // Filtered vocabularies
  filteredTerminologies: Terminology[] = [];
  filteredDeepHits: { [terminologyId: string]: DeepSearchHitList[] };

  // Other generic state
  loading: boolean = true;
  subscriptionsToClean: Subscription[] = [];

  // Template wrappers
  getTerminologyTypeIconDef = getVocabularyTypeMaterialIcon;
  getInformationDomainIconSrc = getInformationDomainSvgIcon;

  // Comparators
  private terminologyComparator =
    comparingLocalizable<Terminology>(this.languageService, terminology => terminology.label);
  private informationDomainComparator =
    comparingLocalizable<{ domain: GroupNode, count: number }>(this.languageService, obj => obj.domain.label);

  // Testing and debugging
  noRightMargin: boolean = false;

  constructor(private authorizationManager: AuthorizationManager,
              private configurationService: ConfigurationService,
              private languageService: LanguageService,
              private translateService: TranslateService,
              private termedService: TermedService,
              private elasticSearchService: ElasticSearchService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  get searchText(): string {
    return this.searchText$.getValue();
  }

  set searchText(value: string) {
    this.searchText$.next(value);
  }

  get searchConcepts(): boolean {
    return this.searchConcepts$.getValue();
  }

  set searchConcepts(value: boolean) {
    this.searchConcepts$.next(value);
  }

  ngOnInit() {
    const initialSearchText$: Observable<string> = this.searchText$.pipe(take(1));
    const debouncedSearchText$: Observable<string> = this.searchText$.pipe(skip(1), debounceTime(500));
    const searchText$: Observable<string> = concat(initialSearchText$, debouncedSearchText$);
    const searchConditions$: Observable<[string, string, boolean, User]> = combineLatest(searchText$, this.languageService.language$, this.searchConcepts$, this.userService.user$);
    this.subscriptionsToClean.push(searchConditions$.subscribe(([text, language, searchConcepts, _user]) => {
      this.elasticSearchService.terminologySearch(new TerminologySearchRequest(text, searchConcepts, language, 1000, 0))
        .subscribe(resp => {
          this.terminologySearchError = false;
          if (resp.totalHitCount != resp.terminologies.length) {
            console.error(`Terminology search did not return all results. Got ${resp.terminologies.length} (start: ${resp.resultStart}, total hits: ${resp.totalHitCount})`);
          }
          this.terminologyResults$.next(resp);
        }, err => {
          if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) {
            this.terminologySearchError = true;
            this.terminologyResults$.next({
              totalHitCount: 0, resultStart: 0, terminologies: [], deepHits: {}
            });
          } else {
            console.error('Model search failed: ' + JSON.stringify(err));
          }
        });
    }));

    this.informationDomains$ = this.termedService.getGroupList();
    this.organizations$ = this.termedService.getOrganizationList().pipe(
      publishReplay(1),
      refCount()
    );

    this.makeSubscriptions();

    this.noRightMargin = !!this.route.snapshot.queryParams['nrr'];
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

  allLanguagesLabel(label: Localizable): string | undefined {
    const exp = /<\/?b>/g;
    const keys = Object.keys(label);
    if (keys.length) {
      return keys.map(key => label[key].replace(exp, '') + ' (' + key + ')').join('\n');
    }
    return undefined;
  }

  private makeSubscriptions() {
    const restrict = this.configurationService.restrictFilterOptions;
    this.subscriptionsToClean.push(
      this.languageService.language$.subscribe(_language => {
        // NOTE: Organization filter contains internal sorting. Statuses are in natural order.
        this.filteredTerminologies.sort(this.terminologyComparator);
        this.applicableInformationDomains.sort(this.informationDomainComparator);
      })
    );
    if (!restrict) {
      // If drop down filter options are not restricted then do not regenerate sets on selection changes.
      this.subscriptionsToClean.push(
        combineLatest(this.terminologyResults$, this.organizations$)
          .subscribe(([terminologyResults, organizations]) => {
            const terminologies = terminologyResults.terminologies;
            const counts: { orgCounts: { [id: string]: number }, statCounts: { [id: string]: number } } = terminologies.reduce((counts, tlogy) => {
              tlogy.contributors.forEach(org => counts.orgCounts[org.id] = counts.orgCounts[org.id] ? counts.orgCounts[org.id] + 1 : 1);
              counts.statCounts[tlogy.status] = counts.statCounts[tlogy.status] ? counts.statCounts[tlogy.status] + 1 : 1;
              return counts;
            }, <{ orgCounts: { [id: string]: number }, statCounts: { [id: string]: number } }>{ orgCounts: {}, statCounts: {} });
            this.applicableOrganizations$.next(organizations.filter(org => counts.orgCounts[org.id]));
            this.applicableStatuses$.next(this.statuses.filter(status => counts.statCounts[status]));
          })
      );
    }
    this.subscriptionsToClean.push(
      combineLatest(
        combineLatest(this.terminologyResults$, this.informationDomains$, this.organizations$),
        combineLatest(this.selectedInformationDomain$, this.selectedOrganization$, this.selectedStatus$))
        .subscribe(([[terminologyResults, domains, organizations], [selectedDomain, selectedOrganization, selectedStatus]]) => {
          const terminologies = terminologyResults.terminologies;
          const accumulated: FilterConstructionState = terminologies.reduce((state, tlogy) => {
            const domainMatch = informationDomainMatches(selectedDomain, tlogy);
            const orgMatch = organizationMatches(selectedOrganization, tlogy);
            const statusMatch = statusMatches(selectedStatus, tlogy);

            if (domainMatch && orgMatch && statusMatch) {
              state.passedTerminologies.push(tlogy);
            }
            if (orgMatch && statusMatch) {
              tlogy.informationDomains.forEach(domain => state.domainCounts[domain.id] = state.domainCounts[domain.id] ? state.domainCounts[domain.id] + 1 : 1);
            }
            if (restrict && domainMatch) {
              if (statusMatch) {
                tlogy.contributors.forEach(org => state.orgCounts[org.id] = state.orgCounts[org.id] ? state.orgCounts[org.id] + 1 : 1);
              }
              if (orgMatch) {
                state.statusCounts[tlogy.status] = state.statusCounts[tlogy.status] ? state.statusCounts[tlogy.status] + 1 : 1;
              }
            }
            return state;
          }, <FilterConstructionState>{ passedTerminologies: [], domainCounts: {}, orgCounts: {}, statusCounts: {} });

          this.filteredTerminologies = accumulated.passedTerminologies.sort(this.terminologyComparator);
          this.filteredDeepHits = {};
          if (terminologyResults.deepHits && Object.keys(terminologyResults.deepHits).length > 0) {
            const dhs = terminologyResults.deepHits;
            this.filteredTerminologies.forEach(tlogy => {
              const hit: DeepSearchHitList[] | undefined = dhs[tlogy.id];
              if (hit) {
                this.filteredDeepHits[tlogy.id] = hit;
              }
            });
          }

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

function informationDomainMatches(informationDomain: GroupNode | null, terminology: Terminology): boolean {
  return !informationDomain || anyMatching(terminology.informationDomains, domain => domain.id === informationDomain.id);
}

function organizationMatches(organization: OrganizationNode | null, terminology: Terminology): boolean {
  return !organization || anyMatching(terminology.contributors, contributor => contributor.id === organization.id);
}

function statusMatches(status: Status | null, terminology: Terminology): boolean {
  return !status || terminology.status === status;
}

type FilterConstructionState = {
  passedTerminologies: Terminology[];
  domainCounts: { [id: string]: number };
  orgCounts: { [id: string]: number };
  statusCounts: { [status: string]: number };
};
