import { Component, Input, OnChanges } from '@angular/core';
import { OrganizationNode } from '../../entities/node';
import { TermedService } from '../../services/termed.service';
import { EditableService } from '../../services/editable.service';
import { replaceMatching } from '../../utils/array';
import { FormControl } from '@angular/forms';
import { FormReferenceLiteral } from '../../services/form-state';

@Component({
  selector: 'organization-input',
  template: `

    <span *ngIf="!editing">{{value.label | translateValue}}</span>
    
    <div *ngIf="editing && organizations" class="form-group" [ngClass]="{'has-danger': valueInError}">
      <div>
        <select class="form-control" required [formControl]="formControl">
          <option [ngValue]="null" translate>No organization</option>
          <option *ngFor="let organization of organizations" [ngValue]="organization">{{organization.label | translateValue}}</option>
        </select>

        <error-messages [control]="formControl"></error-messages>
      </div>
    </div>
  `
})
export class OrganizationInputComponent implements OnChanges {

  @Input() reference: FormReferenceLiteral<OrganizationNode>;
  organizations: OrganizationNode[];

  formControl = new FormControl();

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

    this.formControl.valueChanges.subscribe(value => this.value = value);
  }

  ngOnChanges() {
    this.formControl.setValue(this.reference.singleValue);
  }

  get editing() {
    return this.editableService.editing;
  }

  get value() {
    return this.reference.singleValue as OrganizationNode;
  }

  set value(value: OrganizationNode) {
    this.reference.singleValue = value;
  }
}
