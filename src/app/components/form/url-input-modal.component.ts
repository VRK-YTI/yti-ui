import { Component, Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-url-input-modal',
  styleUrls: ['./url-input-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="select_concept_cancel_link" (click)="cancel()"></i></a>
        <span translate>Enter link target</span>
      </h4>
    </div>
    <div class="modal-body">
      <form>
        <div class="row mb-2">
          <div class="col-md-12">
            <span translate>Enter the full HTTP or HTTPS address (URL) for the link:</span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <input class="form-control" [ngClass]="{'is-invalid': url.invalid && (url.dirty || url.touched)}" type="url" [formControl]="url"
                   placeholder="https://www.example.com"/>
            <app-error-messages *ngIf="url.dirty || url.touched" [control]="url"></app-error-messages>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" id="select_concept_confirm_button" class="btn btn-action confirm"
              [disabled]="url.invalid || !url.dirty" (click)="confirm()" translate>Add link</button>
      <button type="button" id="select_concept_cancel_button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class UrlInputModalComponent {
  private readonly URL_REGEX = /^https?:\/\/[^\s]+$/;

  displayValue: string;
  url = new FormControl('', [Validators.required, Validators.pattern(this.URL_REGEX)]);

  constructor(public modal: NgbActiveModal) {
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close(this.url.value);
  }
}

@Injectable()
export class UrlInputModalService {

  constructor(private modalService: ModalService) {
  }

  open(displayValue: string): Promise<string> {
    const modalRef = this.modalService.open(UrlInputModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as UrlInputModalComponent;
    instance.displayValue = displayValue;
    return modalRef.result;
  }
}
