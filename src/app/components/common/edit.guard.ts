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
    if (target) {
      console.log('ConfirmCancelEditGuard.canDeactivate(' + (<any>target).__proto__.constructor.name + ')');
      if (!target.isEditing()) {
        return Promise.resolve(true);
      } else {
        return this.confirmationModalService.openEditInProgress().then(() => true, () => false);
      }
    } else if (this.activeTabbedComponent) {
      console.log('ConfirmCancelEditGuard.canDeactivate(), with tabbed component');
      if (!this.activeTabbedComponent.isEditing()) {
        return Promise.resolve(true);
      } else {
        return this.confirmationModalService.openEditInProgress().then(() => true, () => false);
      }
    }
     else {
      console.log('ConfirmCancelEditGuard.canDeactivate(' + target + ')');
      return Promise.resolve(true);
    }
  }
}
