import { Component, forwardRef, Input } from '@angular/core';
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
        <button class="dropdown-item" (click)="writeValue('')" translate>All languages</button>
        <button class="dropdown-item" 
                *ngFor="let lang of languages"
                (click)="writeValue(lang)"
                [value]="lang"><span translate>Content in</span> {{lang.toUpperCase()}}
        </button>
      </div>
    </div>
  `
})

export class FilterLanguageComponent implements ControlValueAccessor {

  @Input() languages: string[];

  control = new FormControl();

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(private translateService: TranslateService) {
    this.control.valueChanges.subscribe(x => this.propagateChange(x));
  }

  get selection() {
    return this.control.value ? this.translateService.instant('Content in') + " " + this.control.value.toUpperCase()
                              : this.translateService.instant('All languages');
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
