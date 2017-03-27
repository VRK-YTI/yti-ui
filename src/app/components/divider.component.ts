import { Component, HostListener } from '@angular/core';
import { SessionService } from '../services/session.service';

const leftWidth = 400; // should match variable in concepts.component.scss
const minSelectionWidth = 500;
const normalSelectionWidth = 720;
const minVisualizationWidth = 300;

@Component({
  selector: 'divider',
  styleUrls: ['./divider.component.scss'],
  template: `<div class="divider" (mousedown)="moveDivider($event)"></div>`,
})
export class DividerComponent {

  constructor(private sessionService: SessionService) {
    this.initWidth();
  }

  get selectionWidth() {
    return this.sessionService.selectionWidth;
  }

  set selectionWidth(value: number) {
    this.sessionService.selectionWidth = value;
  }

  @HostListener('window:resize')
  initWidth() {
    this.selectionWidth = Math.min(DividerComponent.maxWidth - minVisualizationWidth, this.sessionService.selectionWidth || normalSelectionWidth);
  }

  static get maxWidth() {
    return window.innerWidth - leftWidth;
  }

  moveDivider(mouseDown: MouseEvent) {

    mouseDown.preventDefault();

    const offset = mouseDown.clientX - this.selectionWidth;

    const onMouseMove = (event: MouseEvent) => {
      const newWidth = event.clientX - offset;

      if ((newWidth >= minSelectionWidth && newWidth < this.selectionWidth)
        || (newWidth <= (DividerComponent.maxWidth - minVisualizationWidth) && newWidth > this.selectionWidth)) {
        this.sessionService.selectionWidth = newWidth;
        this.selectionWidth = newWidth;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}
