import { Directive, ElementRef, OnDestroy, AfterViewInit, NgZone, Input } from '@angular/core';
import { requireDefined } from '../utils/object';

interface Location {
  left: number;
  top: number;
}

@Directive({ selector: '[appFloat]' })
export class FloatDirective implements AfterViewInit, OnDestroy {

  @Input() setWidth = true;

  element: HTMLElement;
  placeholder: HTMLElement;

  floating = false;
  elementStaticLocation: Location;

  constructor(element: ElementRef, private zone: NgZone) {
    this.element = element.nativeElement as HTMLElement;
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onWindowScroll);
    });

    this.elementStaticLocation = this.calculateElementLocation();

    const placeholder = document.createElement('div');
    placeholder.hidden = true;

    requireDefined(this.element.parentElement).insertBefore(placeholder, this.element);

    this.placeholder = placeholder;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
    requireDefined(this.placeholder.parentElement).removeChild(this.placeholder);
  }

  calculateElementLocation(): Location {
    const rect = this.element.getBoundingClientRect();

    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset
    }
  }

  isFloatingPosition() {
    return window.pageYOffset > this.elementStaticLocation.top;
  }

  isStaticPosition() {
    return window.pageYOffset <= this.elementStaticLocation.top;
  }

  isInitialized() {
    return this.elementStaticLocation.top > 0;
  }

  setFloating() {
    this.floating = true;

    const rect = this.element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.placeholder.style.width = width + 'px';
    this.placeholder.style.height = height + 'px';

    this.element.style.top = '0';

    if (this.setWidth) {
      this.element.style.width = width + 'px';
    }

    this.element.classList.add('floating');
  }

  setStatic() {
    this.floating = false;
    this.element.style.top = '';

    if (this.setWidth) {
      this.element.style.width = '';
    }

    this.element.classList.remove('floating');
    this.placeholder.hidden = true;
  }

  onWindowScroll = () => {

    if (!this.floating) {

      const location = this.calculateElementLocation();

      if (location.top > 0) {
        // re-refresh has to be done since location can change due to accordion etc
        this.elementStaticLocation = location;
      }
    }

    if (this.isInitialized()) {
      if (this.floating) {
        if (this.isStaticPosition()) {
          this.setStatic();
        }
      } else {
        if (this.isFloatingPosition()) {
          this.setFloating();
        }
      }
    }
  }
}
