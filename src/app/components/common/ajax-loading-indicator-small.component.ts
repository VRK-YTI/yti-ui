import { Component } from '@angular/core';

const image = require('../../../assets/ajaxLoadingIndicatorSmall.gif');

@Component({
  selector: 'ajax-loading-indicator-small',
  template: `<img [src]="src" />`
})
export class AjaxLoadingIndicatorSmallComponent {
  src = image;
}
