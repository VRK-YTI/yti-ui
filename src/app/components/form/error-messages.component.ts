import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  styleUrls: ['./error-messages.component.scss'],
  template: `
    <div *ngIf="isVisible()">
      <ul class="errors">
        <li [id]="i + '_' + id" *ngFor="let error of control.errors | keys; let i = index">{{error | translate}}</li>
      </ul>
    </div>
  `
})
export class ErrorMessagesComponent {

  @Input() control: FormControl;
  @Input() id: string;

  isVisible() {
    return !this.control.valid;
  }
}
