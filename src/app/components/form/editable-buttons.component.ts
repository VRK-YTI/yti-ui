import { Component, Input } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { NgForm } from '@angular/forms';
import { VocabularyNode } from '../../entities/node';
import { AuthorizationManager } from '../../services/authorization-manager.sevice';

@Component({
  styleUrls: ['./editable-buttons.component.scss'],
  selector: 'app-editable-buttons',
  template: `
    <div *ngIf="canEdit()">
      
      <button type="button" 
              ngbTooltip="{{'Cancel edit' | translate}}"
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
