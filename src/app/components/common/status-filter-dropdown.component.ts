import { Component, Input, OnInit } from '@angular/core';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Status, allStatuses } from 'yti-common-ui/entities/status';

@Component({
  selector: 'app-status-filter-dropdown',
  template: `
    <app-filter-dropdown [options]="statusOptions"
                         id="status_filter_dropdown"
                         [filterSubject]="filterSubject"></app-filter-dropdown>
  `
})
export class StatusFilterDropdownComponent implements OnInit {

  @Input() filterSubject: BehaviorSubject<Status|null>;

  statusOptions: FilterOptions<Status>;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.statusOptions = [null, ...allStatuses].map(status => {
      return {
        value: status,
        name: () => this.translateService.instant(status ? status : 'All statuses'),
        idIdentifier: () => status ? status : 'all_selected'
      }
    });
  }
}
