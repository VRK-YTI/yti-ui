import { Component, Input } from '@angular/core';
import { GroupNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { FormReferenceLiteral } from 'app/services/form-state';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { SearchGroupModalService } from './search-group-modal.component';

@Component({
  selector: 'app-group-input',
  styleUrls: ['./group-input.component.scss'],
  template: `

    <ul *ngIf="!editing">
      <li *ngFor="let domain of reference.value">{{domain.label | translateValue:true}}</li>
    </ul>

    <div *ngIf="editing" [appDragSortable]="reference" [dragDisabled]="!canReorder()">
      <div *ngFor="let domain of reference.value; let i = index"
           class="removable-text"
           [appDragSortableItem]="domain"
           [index]="i">
        <a><i class="fa fa-times" [id]="id + '_' + domain.idIdentifier + '_remove_domain_reference_link'"
              (click)="removeReference(domain)"></i></a>
        <span>{{domain.label | translateValue:true}}</span>
      </div>
      <app-error-messages [id]="id + '_error_messages'" [control]="reference.control"></app-error-messages>
    </div>

    <button type="button"
            [id]="id + '_add_domain_button'"
            class="btn btn-sm btn-action mt-2"
            *ngIf="editing"
            (click)="addReference()" translate>Add information domain</button>
  `
})
export class GroupInputComponent {

  @Input() id: string;
  @Input() reference: FormReferenceLiteral<GroupNode>;

  constructor(private editableService: EditableService,
              private searchInformationDomainModal: SearchGroupModalService) {
  }

  get editing() {
    return this.editableService.editing;
  }

  removeReference(informationDomain: GroupNode) {
    this.reference.removeReference(informationDomain);
  }

  addReference() {

    const restricts = this.reference.value.map(({ id }) => id);

    this.searchInformationDomainModal.open(restricts)
      .then(result => this.reference.addReference(result), ignoreModalClose);
  }

  canReorder() {
    return this.editing && this.reference.value.length > 1;
  }
}
