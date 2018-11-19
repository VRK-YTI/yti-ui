import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { allStatuses, Status } from 'yti-common-ui/entities/status';

@Component({
  selector: 'app-status-filter-dropdown',
  template: `
    <app-filter-dropdown [options]="statusOptions"
                         id="status_filter_dropdown"
                         [filterSubject]="filterSubject"></app-filter-dropdown>
  `
})
export class StatusFilterDropdownComponent implements OnInit, OnDestroy {

  @Input() filterSubject: BehaviorSubject<Status | null>;
  @Input() statuses: Observable<Status[]>;

  statusOptions: FilterOptions<Status>;

  subscriptionToClean: Subscription[] = [];

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    if (this.statuses) {
      this.subscriptionToClean.push(this.statuses.subscribe(statuses => this.constructOptions(statuses)));
    } else {
      this.constructOptions(allStatuses);
    }
  }

  ngOnDestroy() {
    this.subscriptionToClean.forEach(sub => sub.unsubscribe());
  }

  private constructOptions(statuses: Status[]) {
    this.statusOptions = [null, ...statuses].map(status => {
      return {
        value: status,
        name: () => this.translateService.instant(status ? status : 'All statuses'),
        idIdentifier: () => status ? status : 'all_selected'
      }
    });
  }
}
