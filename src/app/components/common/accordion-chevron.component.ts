import { Component } from '@angular/core';
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accordion-chevron',
  template: `<span class="fa" [class.fa-angle-down]="open" [class.fa-angle-right]="!open"></span>`
})
export class AccordionChevronComponent {

  constructor(private ngbAccordion: NgbAccordion, private ngbPanel: NgbPanel) {
  }

  get open() {
    const accordion = this.ngbAccordion as Accordion;
    return accordion.isOpen(this.ngbPanel.id);
  }
}

interface Accordion extends NgbAccordion {
  // FIXME relies on internal implementation
  isOpen(panelId: string): boolean;
}
