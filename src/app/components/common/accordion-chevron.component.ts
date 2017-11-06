import { Component } from '@angular/core';
import { NgbPanel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accordion-chevron',
  template: `<span class="fa" [class.fa-angle-down]="open" [class.fa-angle-right]="!open"></span>`
})
export class AccordionChevronComponent {

  constructor(private ngbPanel: NgbPanel) {
  }

  get open() {
    return this.ngbPanel.isOpen;
  }
}
