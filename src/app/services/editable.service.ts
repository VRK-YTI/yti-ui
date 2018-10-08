import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ErrorModalService } from 'yti-common-ui/components/error-modal.component';
import { UserService } from 'yti-common-ui/services/user.service';
import { isModalClose } from 'yti-common-ui/utils/modal';

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
      if (!loggedIn && this.editing) {
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
      if (err !== 'cancel') {
        this.errorModalService.openSubmitError(err);
      }
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
      if (!isModalClose(err)) {
        this.errorModalService.openSubmitError(err);
      }
      this.removing$.next(false);
    });
  }
}
