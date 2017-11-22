import { Component, Input } from '@angular/core';
import { OrganizationNode, VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { FormReferenceLiteral } from '../../services/form-state';
import { SearchOrganizationModalService } from './search-organization-modal.component';
import { ignoreModalClose } from '../../utils/modal';
import { AuthorizationManager } from '../../services/authorization-manager.sevice';

@Component({
  selector: 'app-organization-input',
  template: `
    <ul *ngIf="!editing">
      <li *ngFor="let organization of reference.value">{{organization.label | translateValue}}</li>
    </ul>

    <div *ngIf="editing">
      <div *ngFor="let organization of reference.value">
        <a><i class="fa fa-times" (click)="removeReference(organization)"></i></a>
        <span>{{organization.label | translateValue}}</span>
      </div>
    </div>

    <button type="button"
            class="btn btn-default"
            *ngIf="editing"
            (click)="addReference()" translate>Add organization</button>
  `
})
export class OrganizationInputComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() reference: FormReferenceLiteral<OrganizationNode>;

  constructor(private editableService: EditableService,
              private searchOrganizationModal: SearchOrganizationModalService,
              private authorizationManager: AuthorizationManager) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(organization: OrganizationNode) {
    this.reference.removeReference(organization);
  }

  addReference() {

    const canEditOnlyOrganizations = this.authorizationManager.canEditOrganizationsIds();
    const allowOnlyOrganizationIds = canEditOnlyOrganizations === 'ALL' ? null : canEditOnlyOrganizations;
    const restrictOrganizationIds = this.reference.value.map(({ id }) => id);

    this.searchOrganizationModal.open(restrictOrganizationIds, allowOnlyOrganizationIds)
      .then(result => this.reference.addReference(result), ignoreModalClose);
  }
}
