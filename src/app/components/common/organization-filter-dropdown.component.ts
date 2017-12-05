import { Component, Input, OnInit } from '@angular/core';
import { OrganizationNode } from 'app/entities/node';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { comparingLocalizable } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-organization-filter-dropdown',
  template: `
    <app-filter-dropdown class="pull-left"
                         [options]="organizationOptions"
                         [filterSubject]="filterSubject"></app-filter-dropdown>
  `
})
export class OrganizationFilterDropdownComponent implements OnInit {

  @Input() filterSubject: BehaviorSubject<OrganizationNode|null>;
  @Input() organizations: Observable<OrganizationNode[]>;

  organizationOptions: FilterOptions<OrganizationNode>;

  constructor(private languageService: LanguageService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.organizations.subscribe(orgs => {

      orgs.sort(comparingLocalizable<OrganizationNode>(this.languageService, org => org.label));

      this.organizationOptions = [
        { value: null, name: () => this.translateService.instant('All organizations') },
        ...orgs.map(org => ({ value: org, name: () => this.languageService.translate(org.label, false)}))
      ];
    });
  }
}
