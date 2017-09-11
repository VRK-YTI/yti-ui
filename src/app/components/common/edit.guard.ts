import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { EditingComponent } from '../../services/editable.service';
import { ConfirmationModalService } from './confirmation-modal.component';

@Injectable()
export class ConfirmCancelEditGuard implements CanDeactivate<EditingComponent> {

  constructor(private confirmationModalService: ConfirmationModalService) {
  }

  canDeactivate(target: EditingComponent) {
    if (!target.isEditing()) {
      return Promise.resolve(true);
    } else {
      return this.confirmationModalService.openEditInProgress().then(() => true, () => false);
    }
  }
}
