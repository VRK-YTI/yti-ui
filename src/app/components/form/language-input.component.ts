import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ietfLanguageTags } from 'yti-common-ui';

@Component({
  selector: 'app-language-input',
  styleUrls: ['./language-input.component.scss'],
  template: `
    <input class="form-control"
           id="language_input"
           [ngClass]="{'is-invalid': !valid}"
           [editable]="false"
           [id]="id"
           [formControl]="control"
           [ngbTypeahead]="languageProvider" />
  `
})
export class LanguageInputComponent implements ControlValueAccessor {

  @Input() id: string;
  control = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(@Self() @Optional() private ngControl: NgControl) {

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.control.valueChanges.subscribe(x => this.propagateChange(x));
  }

  get valid() {
    return !this.ngControl || this.ngControl.valid;
  }

  languageProvider(text$: Observable<string>): Observable<string[]> {
    return text$.map(value => ietfLanguageTags.filter(language => language.toLowerCase().indexOf(value.toLowerCase()) !== -1));
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
