import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy,
  Output
} from '@angular/core';
import { ConceptNode } from '../../entities/node';

@Component({
  selector: 'app-markdown-input-link-popover',
  styleUrls: ['./markdown-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover">

      <h3 class="popover-header">
        <span>{{selectedText}}</span>
        
        <span  class="btn btn-default" (click)="link.next()" ngbTooltip="{{'Link' | translate}}" [placement]="'left'">
          <i class="fa fa-link"></i>
        </span>
      </h3>

      <div class="popover-body">
        <span translate>Unlinked selected text</span>
      </div>
    </div>
  `
})
export class MarkdownInputLinkPopoverComponent implements AfterViewInit, OnDestroy {

  @Input() selectedText: string;
  @Output() link = new EventEmitter<any>();

  private positionRefresher: PopoverPositionRefresher;

  constructor(element: ElementRef, zone: NgZone) {
    this.positionRefresher = new PopoverPositionRefresher(zone, element);
  }

  ngAfterViewInit(): void {
    this.positionRefresher.start();
  }

  ngOnDestroy(): void {
    this.positionRefresher.stop();
  }
}

@Component({
  selector: 'app-markdown-input-unlink-popover',
  styleUrls: ['./markdown-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover">

      <h3 class="popover-header">
        <span *ngIf="!concept" translate>Concept not in references</span>
        <span *ngIf="concept">{{concept.label | translateValue}}</span>

        <span class="btn btn-default" (click)="unlink.next()" ngbTooltip="{{'Unlink' | translate}}" [placement]="'left'">
          <i class="fa fa-unlink"></i>
        </span>
      </h3>

      <div class="popover-body" *ngIf="concept" app-markdown [value]="concept.definitionAsLocalizable | translateValue"></div>
    </div>
  `
})
export class MarkdownInputUnlinkPopoverComponent implements AfterViewInit, OnDestroy {

  @Input() concept: ConceptNode;
  @Output() unlink = new EventEmitter<any>();

  private positionRefresher: PopoverPositionRefresher;

  constructor(element: ElementRef, zone: NgZone) {
    this.positionRefresher = new PopoverPositionRefresher(zone, element);
  }

  ngAfterViewInit(): void {
    this.positionRefresher.start();
  }

  ngOnDestroy(): void {
    this.positionRefresher.stop();
  }
}

class PopoverPositionRefresher {

  private intervalHandle: any;

  constructor(private zone: NgZone, private element: ElementRef) {
  }

  start() {
    this.updateTop();
    this.zone.runOutsideAngular(() => {
      this.intervalHandle = setInterval(() => this.updateTop(), 100);
    });
  }

  stop() {
    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
  }

  updateTop() {
    const element = this.element.nativeElement as HTMLElement;
    element.style.top = '-' + (element.getBoundingClientRect().height + 2) + 'px';
  }
}
