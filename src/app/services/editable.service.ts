import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ErrorModalService } from '../components/common/error.modal';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './user.service';
import { Subscription } from 'rxjs/Subscription';

export interface EditingComponent {
  isEditing(): boolean;
  cancelEditing(): void;
}

@Injectable()
export class EditableService implements OnDestroy {

  editing$ = new BehaviorSubject<boolean>(false);
  saving$ = new BehaviorSubject<boolean>(false);
  removing$ = new BehaviorSubject<boolean>(false);

  onSave: () => Promise<any>|void;
  onRemove: () => Promise<any>|void;
  onCanceled: () => void;

  private loggedInSubscription: Subscription;

  constructor(private errorModalService: ErrorModalService,
              private userService: UserService) {

    this.loggedInSubscription = userService.loggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.cancel();
      }
    });
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

  get editing() {
    return this.editing$.getValue();
  }

  get saving() {
    return this.saving$.getValue();
  }

  get removing() {
    return this.removing$.getValue();
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
      this.errorModalService.openSubmitError(err);
      this.saving$.next(false);
    });
  }

  remove() {
    if (!this.onRemove) {
      throw new Error('Remove handler missing');
    }

    this.removing$.next(true);

    Promise.resolve(this.onRemove()).then(() => {
      this.removing$.next(false);
    }, err => {
      if (err !== 'cancel' && err !== ModalDismissReasons.BACKDROP_CLICK && err !== ModalDismissReasons.ESC) {
        this.errorModalService.openSubmitError(err);
      }
      this.removing$.next(false);
    });
  }
}
