import { Component, Input } from '@angular/core';
import { Status } from 'app/entities/constants';

@Component({
  selector: 'app-status',
  styleUrls: ['./status.component.scss'],
  template: `
    <span [class.bg-danger]="danger"
          [class.bg-warning]="warning"
          [class.bg-gray]="gray"
          [class.bg-success]="success">{{status | translate}}</span>
  `
})
export class StatusComponent {

  @Input() status: string;

  get gray() {
    return this.status === 'Suggestion' as Status;
  }

  get danger() {
    return this.status === 'Deprecated' as Status || this.status === 'Unstable' as Status;
  }

  get warning() {
    return this.status === 'Draft' as Status;
  }

  get success() {
    return this.status === 'Recommendation';
  }
}

