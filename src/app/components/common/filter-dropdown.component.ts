import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Options } from '../form/dropdown-component';

export type FilterOptions<T> = Options<T>;

@Component({
  selector: 'app-filter-dropdown',
  template: `
    <app-dropdown [options]="options"
                  [showNullOption]="true"
                  [(ngModel)]="selection"></app-dropdown>
  `
})
export class FilterDropdownComponent<T> {

  @Input() options: FilterOptions<T>;
  @Input() filterSubject: BehaviorSubject<T>;

  get selection() {
    return this.filterSubject.getValue();
  }

  set selection(value: any) {
    this.filterSubject.next(value);
  }
}
