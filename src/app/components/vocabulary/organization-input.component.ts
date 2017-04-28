import { Component, Input, ViewChild } from '@angular/core';
import { OrganizationNode, Reference } from '../../entities/node';
import { TermedService } from '../../services/termed.service';
import { EditableService } from '../../services/editable.service';
import { replaceMatching } from '../../utils/array';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'organization-input',
  template: `

    <span *ngIf="!editing">{{value.label | translateValue}}</span>
    
    <div *ngIf="editing && organizations" class="form-group" [ngClass]="{'has-danger': valueInError}">
      <div>
        <select class="form-control"
                required
                id="foo"
                name="organization.meta.id"
                [(ngModel)]="value"
                #ngModel="ngModel">
          <option [ngValue]="null" translate>No organization</option>
          <option *ngFor="let organization of organizations" [ngValue]="organization">{{organization.label | translateValue}}</option>
        </select>

        <error-messages [control]="ngModel.control"></error-messages>
      </div>
    </div>
  `
})
export class OrganizationInputComponent {

  @Input() organization: Reference<OrganizationNode>;
  organizations: OrganizationNode[];

  @ViewChild('ngModel') ngModel: NgModel;

  constructor(private editableService: EditableService,
              termedService: TermedService) {

    editableService.editing$.subscribe(editing => {

      if (editing && !this.organizations) {
        termedService.getOrganizationList().subscribe(organizations => {

          const organization = this.value;

          if (organization) {
            replaceMatching(organizations, o => o.id === organization.id, organization);
          }

          this.organizations = organizations;
        });
      }
    });
  }

  get editing() {
    return this.editableService.editing;
  }

  get value() {
    return this.organization.singleValue;
  }

  set value(value: OrganizationNode|null) {
    this.organization.singleValue = value;
  }
}
