import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EditableService {

  private _editing = false;
  _editing$ = new ReplaySubject<boolean>();
  editing$ = this._editing$.distinctUntilChanged();

  constructor() {
    this._editing$.next(this._editing);
  }

  get editing() {
    return this._editing;
  }

  set editing(value: boolean) {
    this._editing = value;
    this._editing$.next(value);
  }
}
