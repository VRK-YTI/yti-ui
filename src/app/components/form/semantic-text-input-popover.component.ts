import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy,
  Output
} from '@angular/core';
import { ConceptNode } from 'app/entities/node';

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

@Component({
  selector: 'app-semantic-text-input-link-popover',
  styleUrls: ['./semantic-text-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover">

      <h3 class="popover-header">
        <span>{{selectedText}}</span>
        <span [id]="id + '_link_popover_button'" class="btn btn-sm btn-action" id="link_button" (click)="link.next()" translate>Link</span>
      </h3>

      <div class="popover-body">
        <span translate>Unlinked selected text</span>
      </div>
    </div>
  `
})
export class SemanticTextInputLinkPopoverComponent implements AfterViewInit, OnDestroy {

  @Input() id: string;
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
  selector: 'app-semantic-text-input-unlink-popover',
  styleUrls: ['./semantic-text-input-popover.component.scss'],
  template: `
    <div #popover role="tooltip" class="popover">

      <h3 class="popover-header">
        <span *ngIf="!concept" translate>Concept not in references</span>
        <span *ngIf="concept">{{concept.label | translateValue}}</span>
        <span [id]="id + '_unlink_popover_button'" class="btn btn-sm btn-action" (click)="unlink.next()" translate>Unlink</span>
      </h3>

      <div class="popover-body" *ngIf="concept" 
           app-semantic-text-plain 
           [value]="concept.definitionAsLocalizable | translateValue"
           [format]="concept.definitionSemanticTextFormat">
      </div>
    </div>
  `
})
export class SemanticTextInputUnlinkPopoverComponent implements AfterViewInit, OnDestroy {

  @Input() id: string;
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
