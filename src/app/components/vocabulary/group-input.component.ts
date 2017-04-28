import { Component, Input } from '@angular/core';
import { GroupNode, Reference } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { TermedService } from '../../services/termed.service';
import { replaceMatching } from '../../utils/array';

@Component({
  selector: 'group-input',
  template: `

    <span *ngIf="!editing">{{value.label | translateValue}}</span>

    <div *ngIf="editing && groups" class="form-group" [ngClass]="{'has-danger': valueInError}">
      <div>
        <select class="form-control"
                required
                [(ngModel)]="value"
                #ngModel="ngModel">
          <option [ngValue]="null" translate>No group</option>
          <option *ngFor="let group of groups" [ngValue]="group">{{group.label | translateValue}}</option>
        </select>

        <error-messages [control]="ngModel.control"></error-messages>
      </div>
    </div>
  `
})
export class GroupInputComponent {

  @Input() group: Reference<GroupNode>;
  groups: GroupNode[];

  constructor(private editableService: EditableService,
              termedService: TermedService) {

    editableService.editing$.subscribe(editing => {
      if (editing && !this.groups) {
        termedService.getGroupList().subscribe(groups => {

          const group = this.value;

          if (group) {
            replaceMatching(groups, g => g.id === group.id, group);
          }

          this.groups = groups;
        });
      }
    });
  }

  get editing() {
    return this.editableService.editing;
  }

  get value() {
    return this.group.singleValue;
  }

  set value(value: GroupNode|null) {
    this.group.singleValue = value;
  }
}
