import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  styleUrls: ['./error-messages.component.scss'],
  template: `
    <div *ngIf="isVisible()">
      <ul class="errors">
        <li *ngFor="let error of control.errors | keys">{{error | translate}}</li>
      </ul>
    </div>
  `
})
export class ErrorMessagesComponent {

  @Input() control: FormControl;

  isVisible() {
    return !this.control.valid;
  }
}
