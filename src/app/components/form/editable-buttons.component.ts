import { Component, Input } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  styleUrls: ['./editable-buttons.component.scss'],
  selector: 'editable-buttons',
  template: `
    <div class="top-actions" *ngIf="isLoggedIn()">
      <button type="button" 
              ngbTooltip="{{'Cancel edit' | translate}}" placement="left"
              #cancelTooltip="ngbTooltip"
              class="btn btn-default pull-right cancel" 
              (click)="cancelTooltip.close(); cancelEditing()"
              [disabled]="operationPending"
              [hidden]="!editing">
        <i class="fa fa-undo"></i>
      </button>
      
      <button type="button" 
              ngbTooltip="{{'Save changes' | translate}}"
              #saveTooltip="ngbTooltip"
              class="btn btn-default pull-right save" 
              (click)="saveTooltip.close(); saveEdited()" 
              [hidden]="!editing" 
              [disabled]="!canSave() || operationPending">
        <i class="fa fa-floppy-o"></i>
      </button>
      
      <button type="button"
              ngbTooltip="{{'Edit' | translate}}"
              #editTooltip="ngbTooltip"
              class="btn btn-default pull-right edit" 
              (click)="editTooltip.close(); startEditing()"
              [disabled]="operationPending"
              [hidden]="editing">
        <i class="fa fa-pencil"></i>
      </button>

      <button type="button"
              ngbTooltip="{{'Remove' | translate}}"
              #removeTooltip="ngbTooltip"
              [triggers]="'hover:blur'"
              class="btn btn-default pull-right remove"
              (click)="removeTooltip.close(); remove()"
              [disabled]="operationPending"
              [hidden]="editing || !canRemove">
        <i class="fa fa-trash"></i>
      </button>

      <ajax-loading-indicator-small class="pull-right" *ngIf="operationPending"></ajax-loading-indicator-small>
    </div>
  `
})
export class EditableButtonsComponent {

  @Input() form: NgForm;
  @Input() canRemove: boolean;

  constructor(private editableService: EditableService,
              private userService: UserService) {
  }

  get operationPending() {
    return this.saving || this.removing;
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  get editing() {
    return this.editableService.editing;
  }

  get saving() {
    return this.editableService.saving;
  }

  get removing() {
    return this.editableService.removing;
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

  remove() {
    this.editableService.remove();
  }
}
