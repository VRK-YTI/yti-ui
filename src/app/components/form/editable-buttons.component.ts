import { Component, Input } from '@angular/core';
import { EditableService } from 'app/services/editable.service';
import { NgForm } from '@angular/forms';
import { VocabularyNode } from 'app/entities/node';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';

@Component({
  styleUrls: ['./editable-buttons.component.scss'],
  selector: 'app-editable-buttons',
  template: `
    <div *ngIf="canEdit()">
      
      <button type="button"
              id="editable_cancel_editing_button"
              class="btn btn-link pull-right cancel" 
              (click)="cancelEditing()"
              [disabled]="operationPending"
              [hidden]="!editing">
        <span translate>Cancel</span>
      </button>
      
      <button type="button"
              id="editable_save_edited_button"
              class="btn btn-action pull-right save" 
              (click)="saveEdited()" 
              [hidden]="!editing" 
              [disabled]="!canSave() || operationPending">
        <span translate>Save</span>
      </button>
      
      <button type="button"
              id="editable_start_editing_button"
              class="btn btn-action pull-right edit" 
              (click)="startEditing()"
              [disabled]="operationPending"
              [hidden]="editing">
        <span translate>Edit</span>
      </button>

      <button type="button"
              id="editable_remove_button"
              class="btn btn-link pull-right remove"
              (click)="remove()"
              [disabled]="operationPending"
              [hidden]="editing || !canRemove">
        <i class="fa fa-trash"></i>
        <span translate>Remove</span>
      </button>

      <app-ajax-loading-indicator-small class="pull-right" *ngIf="operationPending"></app-ajax-loading-indicator-small>
    </div>
  `
})
export class EditableButtonsComponent {

  @Input() vocabulary?: VocabularyNode;
  @Input() form: NgForm;
  @Input() canRemove: boolean;

  constructor(private editableService: EditableService,
              private authorizationManager: AuthorizationManager) {
  }

  get operationPending() {
    return this.saving || this.removing;
  }

  canEdit() {
    // when creating new vocabulary the vocabulary is not present
    return !this.vocabulary || this.authorizationManager.canEdit(this.vocabulary);
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
