import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'filter-language',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterLanguageComponent),
    multi: true
  }],
  template: `    
    <select class="form-control" [(ngModel)]="selectedValue">
      <option value="" translate>All languages</option>
      <option *ngFor="let lang of languages" [ngValue]="lang">{{lang.toUpperCase()}}</option>
    </select>
  `
})

export class FilterLanguageComponent implements ControlValueAccessor {

  @Input() languages: string[];

  languageValue: string;

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  writeValue(obj: any): void {    
    this.languageValue = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  get selectedValue() {
    return this.languageValue;
  }

  set selectedValue(value: string) {
    this.languageValue = value;
    this.propagateChange(value);
  }

}