import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { namespace } from '../../entities/constants';

@Component({
  selector: 'app-prefix-input',
  styleUrls: ['./prefix-input.component.scss'],
  template: `
    <div class="row">
    
      <div class="col-md-6">
        <dl>
          <dt><label for="prefix" translate>Prefix</label></dt>
          <dd>
            <div class="form-group">
              <input type="text"
                    class="form-control"
                    id="prefix"
                    autocomplete="off"
                    [ngClass]="{'is-invalid': !control.valid}"
                    [formControl]="control" />
              <app-error-messages [control]="parentControl"></app-error-messages>
            </div>
          </dd>
        </dl>
      </div>
    
      <div class="col-md-6">
        <dl>
          <dt><label translate>Namespace</label></dt>
          <dd>
            <div class="form-group">
              {{namespace}}{{control.value}}
            </div>
          </dd>
        </dl>
      </div>
    
    </div>
  `
})
export class PrefixInputComponent implements ControlValueAccessor {
  
  control = new FormControl();
  namespace = namespace;

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(@Self() @Optional() public parentControl: NgControl) {

    if (parentControl) {
      parentControl.valueAccessor = this;
    }

    this.control.valueChanges.subscribe(x => this.propagateChange(x));
  }

  get valid() {
    return !this.parentControl || this.parentControl.valid;
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
