import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-filter-language',
  styleUrls: ['./filter-language.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterLanguageComponent),
    multi: true
  }],
  template: `    
    <select class="form-control" [formControl]="control">
      <option value="" translate>All languages</option>
      <option *ngFor="let lang of languages" [ngValue]="lang">{{lang.toUpperCase()}}</option>
    </select>
  `
})

export class FilterLanguageComponent implements ControlValueAccessor {

  @Input() languages: string[];

  control = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor() {
    this.control.valueChanges.subscribe(x => this.propagateChange(x));
  }

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
}
