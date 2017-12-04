import { Component, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { TermedService } from '../../services/termed.service';

@Component({
  selector: 'app-prefix-input',
  styleUrls: ['./prefix-input.component.scss'],
  template: `
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="prefix" translate>Prefix</label>
          <input type="text"
                 class="form-control"
                 id="prefix"
                 autocomplete="off"
                 [ngClass]="{'is-invalid': !valid}"
                 [formControl]="control" />
          <app-error-messages [control]="parentControl"></app-error-messages>
        </div>
      </div>
    
      <div class="col-md-6">
        <div class="form-group"></div>
        <label translate>Namespace</label>
        <p class="form-control-static">{{namespace}}{{control.value}}</p>
      </div>
    
    </div>
  `
})
export class PrefixInputComponent implements ControlValueAccessor {

  control = new FormControl();
  namespace: string;

  private propagateChange: (fn: any) => void = () => {};
  private propagateTouched: (fn: any) => void = () => {};

  constructor(@Self() @Optional() public parentControl: NgControl,
              termedService: TermedService) {

    termedService.getNamespaceRoot().subscribe(namespace => this.namespace = namespace);

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
