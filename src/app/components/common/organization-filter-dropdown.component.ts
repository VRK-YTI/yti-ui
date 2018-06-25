import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OrganizationNode } from 'app/entities/node';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { comparingLocalizable } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-organization-filter-dropdown',
  template: `
    <app-filter-dropdown class="pull-left"
                         id="organization_filter_dropdown"
                         [options]="organizationOptions"
                         [filterSubject]="filterSubject"></app-filter-dropdown>
  `
})
export class OrganizationFilterDropdownComponent implements OnInit, OnDestroy {

  @Input() filterSubject: BehaviorSubject<OrganizationNode|null>;
  @Input() organizations: Observable<OrganizationNode[]>;

  organizationOptions: FilterOptions<OrganizationNode>;

  subscriptionToClean: Subscription[] = [];

  constructor(private languageService: LanguageService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.subscriptionToClean.push(Observable.combineLatest(this.organizations, this.languageService.language$)
      .subscribe(([orgs]) => {

        orgs.sort(comparingLocalizable<OrganizationNode>(this.languageService, org => org.label));

        this.organizationOptions = [
          {
            value: null,
            name: () => this.translateService.instant('All organizations'),
            idIdentifier: () => 'all_selected'
          },
          ...orgs.map(org => ({
            value: org,
            name: () => this.languageService.translate(org.label, true),
            idIdentifier: () => org.getIdIdentifier(this.languageService, true)
          }))
        ];
      }));
  }

  ngOnDestroy(): void {
    this.subscriptionToClean.forEach(s => s.unsubscribe());
  }
}
