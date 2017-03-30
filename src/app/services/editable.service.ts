import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EditableService {

  editing$ = new BehaviorSubject<boolean>(false);
  saving$ = new BehaviorSubject<boolean>(false);

  onSave: () => Promise<any>|void;
  onCancel: () => Promise<any>|void;

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
    if (!this.onCancel) {
      throw new Error('Cancel handler missing');
    }

    Promise.resolve(this.onCancel()).then(() => {
      this.editing$.next(false);
    });
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
