import { Component } from '@angular/core';
import { EditableService } from '../services/editable.service';
import { NgForm } from '@angular/forms';

@Component({
  styleUrls: ['./editable-buttons.component.scss'],
  selector: 'editable-buttons',
  template: `
    <div class="top-actions">
      <button type="button" 
              ngbTooltip="{{'Cancel edit' | translate}}" placement="left"
              class="btn btn-default pull-right cancel" 
              (click)="cancelEditing()"
              [disabled]="saving"
              [hidden]="!editing">
              <i class="fa fa-undo"></i>
      </button>
      
      <button type="button" 
              ngbTooltip="{{'Save changes' | translate}}"
              class="btn btn-default pull-right save" 
              (click)="saveEdited()" 
              [hidden]="!editing" 
              [disabled]="!canSave() || saving">
              <i class="fa fa-floppy-o"></i>
      </button>
      
      <button type="button"
              ngbTooltip="{{'Edit' | translate}}"
              class="btn btn-default pull-right edit" 
              (click)="startEditing()"
              [disabled]="saving"
              [hidden]="editing">
              <i class="fa fa-pencil"></i>
      </button>
    </div>
  `
})
export class EditableButtonsComponent {

  constructor(public form: NgForm, private editableService: EditableService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  get saving() {
    return this.editableService.saving;
  }

  startEditing() {
    this.editableService.edit();
  }

  canSave() {
    return !this.form.invalid && !this.form.pending;
  }

  cancelEditing() {
    this.editableService.cancel();
  }

  saveEdited() {
    this.editableService.save();
  }
}
