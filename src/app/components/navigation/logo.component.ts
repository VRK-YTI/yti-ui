import { Component } from '@angular/core';

@Component({
    selector: 'app-logo',
    styleUrls: ['./logo.component.scss'],
  template: `<img [src]="logo" />`
})
export class LogoComponent {
  logo = require('../../../assets/logo.svg');
}
