import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { statuses } from '../../entities/constants';

@Component({
  selector: 'status-input',
  styleUrls: ['./status-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StatusInputComponent),
    multi: true
  }],
  template: `    
    <select class="form-control"
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

  constructor() {
    this.select.valueChanges.subscribe(x => this.propagateChange(x));
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
