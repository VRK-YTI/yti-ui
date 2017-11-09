import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { statuses } from '../../entities/constants';

@Component({
  selector: 'app-status-input',
  styleUrls: ['./status-input.component.scss'],
  template: `
    <select class="form-control"
            [ngClass]="{'is-invalid': !valid}"
            [id]="id"
            [formControl]="select">
      <option *ngFor="let status of statuses" [ngValue]="status">{{status | translate}}</option>
    </select>
  `
})
export class StatusInputComponent implements ControlValueAccessor {

  @Input() id: string;

  statuses = statuses;

  select = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    this.select.valueChanges.subscribe(x => this.propagateChange(x));
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
