import { Component, HostListener } from '@angular/core';
import { SessionService } from '../services/session.service';

const leftWidth = 400; // should match variable in concepts.component.scss
const minSelectionWidth = 500;
const minVisualizationWidth = 300;

@Component({
  selector: 'divider',
  styleUrls: ['./divider.component.scss'],
  template: `<div class="divider" (mousedown)="moveDivider($event)"></div>`,
})
export class DividerComponent {

  constructor(private sessionService: SessionService) {
    this.setConstrainedSelectionWidth(this.sessionService.selectionWidth);
  }

  get selectionWidth() {
    return this.sessionService.selectionWidth;
  }

  set selectionWidth(value: number) {
    this.sessionService.selectionWidth = value;
  }

  @HostListener('window:resize')
  onResize() {
    this.setConstrainedSelectionWidth(this.selectionWidth);
  }

  setConstrainedSelectionWidth(selectionWidth: number) {
    const maxSelectionWidth = DividerComponent.maxWidth - minVisualizationWidth;
    this.selectionWidth = Math.max(minSelectionWidth, Math.min(maxSelectionWidth, selectionWidth));
  }

  static get maxWidth() {
    return window.innerWidth - leftWidth;
  }

  moveDivider(mouseDown: MouseEvent) {

    mouseDown.preventDefault();

    const offset = mouseDown.clientX - this.selectionWidth;

    const onMouseMove = (event: MouseEvent) => {
      this.setConstrainedSelectionWidth(event.clientX - offset)
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}
