import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-filter-language',
  styleUrls: ['./filter-language.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterLanguageComponent),
    multi: true
  }],
  template: ` 
    <div ngbDropdown class="d-inline-block lang-filter">
      <button class="btn btn-default" id="dropdownFilterLanguage" ngbDropdownToggle>{{selection}}</button>
      <div ngbDropdownMenu aria-labelledby="dropdownFilterLanguage">
        <button class="dropdown-item" 
                *ngFor="let selection of selections"
                (click)="writeValue(selection.lang)">
          {{selection.name}}
        </button>
      </div>
    </div>
  `
})
export class FilterLanguageComponent implements ControlValueAccessor, OnChanges {

  @Input() languages: string[];
  selections: { lang: string, name: string }[];

  control = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(private translateService: TranslateService) {
    this.control.valueChanges.subscribe(x => this.propagateChange(x));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selections = ['', ...this.languages].map(lang => ({
      lang: lang,
      name: this.languageToSelectionName(lang)
    }));
  }

  get selection() {
    return this.languageToSelectionName(this.control.value);
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

  private languageToSelectionName(lang: string) {
    return lang ? this.translateService.instant('Content in') + ' '  + lang.toUpperCase()
                : this.translateService.instant('All languages');
  }
}
