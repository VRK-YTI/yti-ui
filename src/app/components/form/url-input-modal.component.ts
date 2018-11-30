import { AfterViewInit, Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'app/services/modal.service';
import { FormControl, Validators } from '@angular/forms';
import { httpOrHttpsUrlRegex } from 'yti-common-ui/utils/validator';

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
            <input #urlInput
                   type="url"
                   class="form-control"
                   placeholder="https://www.example.com"
                   [ngClass]="{'is-invalid': url.invalid && (url.dirty || url.touched)}"
                   [formControl]="url"
                   (keyup.enter)="confirm()"/>
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
export class UrlInputModalComponent implements AfterViewInit {
  displayValue: string;
  @ViewChild('urlInput') urlInput: ElementRef;
  url = new FormControl('', [Validators.required, Validators.pattern(httpOrHttpsUrlRegex)]);

  constructor(public modal: NgbActiveModal) {
  }

  ngAfterViewInit() {
    this.urlInput.nativeElement.focus();
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    if (this.url.valid && this.url.dirty) {
      this.modal.close(this.url.value);
    }
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
