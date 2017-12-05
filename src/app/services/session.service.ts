import { isDefined } from 'yti-common-ui/utils/object';
import { Injectable } from '@angular/core';

const selectionWidthKey = 'selectionWidth';

@Injectable()
export class SessionService {

  constructor() {
    if (!this.selectionWidth) {
      this.selectionWidth = 720;
    }
  }

  private static get<T>(key: string): T {
    const value = window.sessionStorage.getItem(key);
    return isDefined(value) ? JSON.parse(value) : null;
  }

  private static set(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  get selectionWidth(): number {
    return SessionService.get<number>(selectionWidthKey);
  }

  set selectionWidth(value: number) {
    SessionService.set(selectionWidthKey, value);
  }
}
