import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Status, statuses } from '../../entities/constants';
import { Options } from 'yti-common-ui/components/dropdown.component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-status-input',
  styleUrls: ['./status-input.component.scss'],
  template: `
    <app-dropdown [formControl]="select" [options]="statusOptions"></app-dropdown>
  `
})
export class StatusInputComponent implements ControlValueAccessor {

  @Input() id: string;

  statusOptions: Options<Status>;
  select = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(@Self() @Optional() private ngControl: NgControl,
              translateService: TranslateService) {

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.select.valueChanges.subscribe(x => this.propagateChange(x));
    this.statusOptions = statuses.map(status => ({
      value: status,
      name: () => translateService.instant(status)
    }));
  }

  get valid() {
    return !this.ngControl || this.ngControl.valid;
  }

  writeValue(obj: any): void {
    this.select.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
}
