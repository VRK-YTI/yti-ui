import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone,
  Output
} from '@angular/core';
import { ConceptNode } from '../../entities/node';

@Component({
  selector: 'markdown-input-link-popover',
  styleUrls: ['./markdown-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover popover-top">

      <h3 class="popover-title">
        <span>{{selectedText}}</span>
        
        <span  class="btn btn-default" (click)="link.next()" ngbTooltip="{{'Link' | translate}}" [placement]="'left'">
          <i class="fa fa-link"></i>
        </span>
      </h3>

      <div class="popover-content">
        <span translate>Unlinked selected text</span>
      </div>
    </div>
  `
})
export class MarkdownInputLinkPopoverComponent implements AfterViewInit {

  @Input() selectedText: string;
  @Output() link = new EventEmitter<any>();

  constructor(private element: ElementRef, private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    new PopoverPositionSetter(this.zone, this.element).update();
  }
}

@Component({
  selector: 'markdown-input-unlink-popover',
  styleUrls: ['./markdown-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover popover-top">

      <h3 class="popover-title">
        <span *ngIf="!concept" translate>Concept not in references</span>
        <span *ngIf="concept">{{concept.label | translateValue}}</span>

        <span class="btn btn-default" (click)="unlink.next()" ngbTooltip="{{'Unlink' | translate}}" [placement]="'left'">
          <i class="fa fa-unlink"></i>
        </span>
      </h3>

      <div class="popover-content" *ngIf="concept" markdown [value]="concept.definition | translateValue"></div>
    </div>
  `
})
export class MarkdownInputUnlinkPopoverComponent implements AfterViewInit {

  @Input() concept: ConceptNode;
  @Output() unlink = new EventEmitter<any>();

  constructor(private element: ElementRef, private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    new PopoverPositionSetter(this.zone, this.element).update();
  }
}

class PopoverPositionSetter {

  private timesUpdated = 0;
  private intervalHandle: any;

  constructor(private zone: NgZone, private element: ElementRef) {
  }

  update() {
    this.updateTop();
    this.intervalHandle = setInterval(() => this.updateTop(), 100);
  }

  updateTop() {
    this.zone.runOutsideAngular(() => {

      if (this.timesUpdated > 20) {
        clearInterval(this.intervalHandle);
        this.intervalHandle = null;
      }

      this.timesUpdated++;
      const element = this.element.nativeElement as HTMLElement;
      element.style.top = '-' + (element.getBoundingClientRect().height + 2) + 'px';
    });
  }
}
