import { ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { EditingComponent } from 'app/services/editable.service';
import { ConfirmationModalService } from 'yti-common-ui/components/confirmation-modal.component';

@Injectable()
export class ConfirmCancelEditGuard implements CanDeactivate<EditingComponent> {

  // This is an unfortunate hack to handle EditingComponents that do not have their own routes but are instead "behind" tabset.
  // This works if the actual routed component is also EditingComponent, has this edit guard, and is currently hidden by the tabset.
  activeTabbedComponent?: EditingComponent;

  constructor(private confirmationModalService: ConfirmationModalService) {
  }

  canDeactivate(target: EditingComponent, currentRoute: ActivatedRouteSnapshot) {
    const actualTarget = target || this.activeTabbedComponent;
    if (actualTarget) {
      if (actualTarget.isEditing()) {
        return this.confirmationModalService.openEditInProgress().then(() => {
          actualTarget.cancelEditing();
          return true;
        }, () => false);
      }
    } else {
      console.warn('ConfirmCancelEditGuard.canDeactivate() called without direct or implicit target');
    }
    return true;
  }
}
