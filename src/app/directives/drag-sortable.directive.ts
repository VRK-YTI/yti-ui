import { Directive, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { requireDefined } from 'yti-common-ui/utils/object';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface Sortable<T> {
  sortableValues: T[];
  moveItem(fromIndex: number, toIndex: number): void;
}

interface Drag {
  fromIndex: number;
  droppable: boolean;
  cloneCreated: boolean;
  sourceWidth: number;
}

interface PositionChange {
  fromIndex: number;
  toIndex: number;
}

@Directive({
  selector: '[appDragSortable]'
})
export class DragSortableDirective<T> implements OnChanges {

  @Input('appDragSortable') sortable: Sortable<T>;
  @Input() dragDisabled = false;
  @Output() positionChange = new EventEmitter<PositionChange>();

  disabled$ = new BehaviorSubject(false);

  drag$ = new BehaviorSubject<Drag|null>(null);
  dragValuesOriginal: T[]|null = null;

  constructor(private zone: NgZone) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    const previouslyDisabled = this.disabled$.getValue();

    if ((this.dragDisabled && !previouslyDisabled) || !this.dragDisabled && previouslyDisabled) {
      this.disabled$.next(this.dragDisabled);
    }
  }

  startDrag(dataTransfer: DataTransfer, fromIndex: number, sourceWidth: number): void {

    dataTransfer.setData('text', '');
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';

    this.drag = { fromIndex, droppable: true, cloneCreated: false, sourceWidth };
    this.dragValuesOriginal = this.sortable.sortableValues.slice();
  }

  get drag(): Drag|null {
    return this.drag$.getValue();
  }

  set drag(value: Drag|null) {
    this.drag$.next(value);
  }

  cloneCreated() {
    if (this.drag) {
      this.drag.cloneCreated = true;
    }
  }

  overDroppable(toIndex: number, targetWidth: number, mousePosition: number): void {

    if (this.drag) {

      const sourceWidth = this.drag.sourceWidth;
      const toLeft = toIndex < this.drag.fromIndex;
      const stableDropRegion = toLeft ? mousePosition < sourceWidth : mousePosition > targetWidth - sourceWidth;

      if (stableDropRegion) {

        if (this.canDrop(toIndex)) {

          const fromIndex = this.drag.fromIndex;

          this.zone.run(() => {
            this.drag = {...this.drag!, fromIndex: toIndex, droppable: true};
            this.sortable.moveItem(fromIndex, toIndex);
            this.positionChange.emit({fromIndex, toIndex});
          });

        } else {
          this.drag = {...this.drag, droppable: true};
        }
      }
    }
  }

  notOverDroppable(): void {

    if (this.drag) {
      this.drag = {...this.drag, droppable: false};
    }
  }

  canDrop(index: number): boolean {
    return this.drag ? this.drag.fromIndex !== index : false;
  }

  drop(): void {

    if (this.drag && !this.drag.droppable) {

      const dragValuesOriginal = this.dragValuesOriginal;

      this.zone.run(() => {
        this.sortable.sortableValues = requireDefined(dragValuesOriginal);
      });
    }
    this.drag = null;
    this.dragValuesOriginal = null;
  }
}

@Directive({
  selector: '[appDragSortableItem]'
})
export class DragSortableItemDirective<T> implements OnInit, OnDestroy {

  @Input('appDragSortableItem') item: T;
  @Input() index: number;

  private element: HTMLElement;
  private subscriptionsToClean: Subscription[] = [];

  private dragStartHandler = (event: DragEvent) =>
    this.dragSortable.startDrag(event.dataTransfer, this.index, this.element.getBoundingClientRect().width);

  private dragEndHandler = () =>
    this.dragSortable.drop();

  private dragOverHandler = (event: DragEvent) => {

    if (this.dragSortable.drag) {

      event.preventDefault();
      const mousePosition = event.clientX - this.element.getBoundingClientRect().left;
      this.dragSortable.overDroppable(this.index, this.element.getBoundingClientRect().width, mousePosition);
    }
  };

  private dragLeaveHandler = () =>
    this.dragSortable.notOverDroppable();

  private dragEnterHandler = () =>
    this.dragSortable.cloneCreated();

  private dropHandler = (event: DragEvent) => {
    event.preventDefault();
    this.dragSortable.drop();
  };

  constructor(private dragSortable: DragSortableDirective<T>,
              private zone: NgZone,
              elementRef: ElementRef) {

    this.element = elementRef.nativeElement;
  }

  ngOnInit() {

    this.zone.runOutsideAngular(() => {

      this.subscriptionsToClean.push(
        this.dragSortable.disabled$.subscribe(disabled => {
          if (disabled) {
            this.disable();
          } else {
            this.enable();
          }
        })
      );

      this.subscriptionsToClean.push(
        this.dragSortable.drag$.subscribe(drag => {

          const dragReady = drag ? drag.cloneCreated : false;
          const dragged = dragReady && drag!.fromIndex === this.index;
          const droppable = dragReady && drag!.droppable;

          if (dragged) {
            this.element.classList.add('dragged');
          } else {
            this.element.classList.remove('dragged');
          }

          if (droppable) {
            this.element.classList.add('droppable');
          } else {
            this.element.classList.remove('droppable');
          }
        })
      );
    });
  }

  ngOnDestroy() {

    this.disable();
    this.subscriptionsToClean.forEach(s => s.unsubscribe());
    this.subscriptionsToClean = [];
  }

  private enable() {

    this.zone.runOutsideAngular(() => {

      this.element.setAttribute('draggable', 'true');
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
      this.element.addEventListener('dragenter', this.dragEnterHandler);
      this.element.addEventListener('drop', this.dropHandler);
    });
  }

  private disable() {

    this.element.setAttribute('draggable', 'false');
    this.element.removeEventListener('dragstart', this.dragStartHandler);
    this.element.removeEventListener('dragend', this.dragEndHandler);
    this.element.removeEventListener('dragover', this.dragOverHandler);
    this.element.removeEventListener('dragleave', this.dragLeaveHandler);
    this.element.removeEventListener('dragenter', this.dragEnterHandler);
    this.element.removeEventListener('drop', this.dropHandler);
  }
}
