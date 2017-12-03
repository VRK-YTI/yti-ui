import { Component, Input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popover-close',
  styleUrls: ['./popover-close.component.scss'],
  template: `<i class="fa fa-times" (click)="close()"></i>`
})
export class PopoverCloseComponent {

  @Input() popover: NgbPopover;

  close() {
    this.popover.close();
  }
}
