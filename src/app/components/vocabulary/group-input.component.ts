import { Component, Input } from '@angular/core';
import { GroupNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { TermedService } from '../../services/termed.service';
import { replaceMatching } from '../../utils/array';
import { FormReferenceLiteral } from '../../services/form-state';

@Component({
  selector: 'app-group-input',
  template: `

    <span *ngIf="!editing">{{reference.singleValue.label | translateValue:false}}</span>

    <div *ngIf="editing && groups" class="form-group" [ngClass]="{'has-danger': valueInError()}">
      <div>
        <select class="form-control" [formControl]="reference.control">
          <option *ngIf="reference.valueEmpty" [ngValue]="null" translate>No group</option>
          <option *ngFor="let group of groups" [ngValue]="group">{{group.label | translateValue:false}}</option>
        </select>

        <app-error-messages [control]="reference.control"></app-error-messages>
      </div>
    </div>
  `
})
export class GroupInputComponent {

  @Input() reference: FormReferenceLiteral<GroupNode>;
  groups: GroupNode[];

  constructor(private editableService: EditableService,
              termedService: TermedService) {

    editableService.editing$.subscribe(editing => {
      if (editing && !this.groups) {
        termedService.getGroupList().subscribe(groups => {

          const group = this.reference.singleValue;

          if (group) {
            replaceMatching(groups, g => g.id === group.id, group);
          }

          this.groups = groups;
        });
      }
    });
  }

  valueInError() {
    return !this.reference.control.valid;
  }

  get editing() {
    return this.editableService.editing;
  }
}
