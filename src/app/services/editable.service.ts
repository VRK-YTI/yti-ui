import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EditableService {

  editing$ = new BehaviorSubject<boolean>(false);
  saving$ = new BehaviorSubject<boolean>(false);

  onSave: () => Promise<any>|void;
  onCanceled: () => void;

  get editing() {
    return this.editing$.getValue();
  }

  get saving() {
    return this.saving$.getValue();
  }

  edit() {
    this.editing$.next(true);
  }

  cancel() {
    if (!this.onCanceled) {
      throw new Error('Cancel handler missing');
    }

    this.editing$.next(false);
    this.onCanceled();
  }

  save() {
    if (!this.onSave) {
      throw new Error('Save handler missing');
    }

    this.saving$.next(true);

    Promise.resolve(this.onSave()).then(() => {
      this.saving$.next(false);
      this.editing$.next(false);
    }, err => {
      this.saving$.next(false);
    });
  }
}
