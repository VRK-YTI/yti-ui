import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ConfirmationModalService {

  constructor(private modalService: NgbModal) {
  }

  private open(title: string, body: string): Promise<any> {
    const modalRef = this.modalService.open(ConfirmationModal, { size: 'sm' });
    const instance = modalRef.componentInstance as ConfirmationModal;
    instance.title = title;
    instance.body = body;
    return modalRef.result;
  }

  openEditInProgress() {
    return this.open('Edit in progress', 'Are you sure that you want to continue? By continuing unsaved changes will be lost.');
  }
}

@Component({
  selector: 'edit-cancel-confirmation-modal',
  styleUrls: ['./delete-confirmation.modal.scss'],
  template: `
    <div class="modal-header modal-header-warning">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span>{{title | translate}}</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
          <p>{{body | translate}}</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary confirm" (click)="confirm()" translate>Yes</button>
      <button type="button" class="btn btn-default cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class ConfirmationModal {

  @Input() title: string;
  @Input() body: string;

  constructor(private modal: NgbActiveModal) {
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }
}
