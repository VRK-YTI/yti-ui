import { Component, Input, OnChanges } from '@angular/core';
import { GroupNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { TermedService } from '../../services/termed.service';
import { replaceMatching } from '../../utils/array';
import { FormReferenceLiteral } from '../../services/form-state';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'group-input',
  template: `

    <span *ngIf="!editing">{{value.label | translateValue}}</span>

    <div *ngIf="editing && groups" class="form-group" [ngClass]="{'has-danger': valueInError}">
      <div>
        <select class="form-control" required [formControl]="formControl">
          <option [ngValue]="null" translate>No group</option>
          <option *ngFor="let group of groups" [ngValue]="group">{{group.label | translateValue}}</option>
        </select>

        <error-messages [control]="formControl"></error-messages>
      </div>
    </div>
  `
})
export class GroupInputComponent implements OnChanges {

  @Input() reference: FormReferenceLiteral<GroupNode>;
  groups: GroupNode[];

  formControl = new FormControl();

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

    this.formControl.valueChanges.subscribe(value => this.value = value);
  }

  ngOnChanges() {
    this.formControl.setValue(this.reference.singleValue);
  }

  get editing() {
    return this.editableService.editing;
  }

  get value() {
    return this.reference.singleValue as GroupNode;
  }

  set value(value: GroupNode) {
    this.reference.singleValue = value;
  }
}
