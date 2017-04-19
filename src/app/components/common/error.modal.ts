import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Injectable()
export class ErrorModalService {

  constructor(private modalService: NgbModal) {
  }

  openSubmitError(err?: any) {
    const modalRef = this.modalService.open(ErrorModal, { size: 'sm' });
    const instance = modalRef.componentInstance as ErrorModal;
    instance.title = 'Submit error';
    instance.body = 'Unexpected error';
    instance.error = err;
  }
}

@Component({
  selector: 'error-modal',
  styleUrls: ['./error.modal.scss'],
  template: `
    <div class="modal-header modal-header-danger">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="close()"></i></a>
        <span>
          <i class="fa fa-exclamation-circle"></i>
          {{title | translate}}
        </span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">

          <p>{{body | translate}}</p>
          <pre *ngIf="showError">{{error | json}}</pre>
          
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="close()" translate>Close</button>
    </div>
  `
})
export class ErrorModal {

  @Input() title: string;
  @Input() body: string;
  @Input() error: any;

  constructor(private modal: NgbActiveModal) {
  }

  close() {
    this.modal.dismiss();
  }

  get showError() {
    return !environment.production;
  }
}
