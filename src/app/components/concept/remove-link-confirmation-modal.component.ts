import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'yti-common-ui/services/modal.service';
import { Localizable } from 'yti-common-ui/types/localization';
import { LanguageService } from '../../services/language.service';

export interface ReferenceLabels { referenceLabel: Localizable, containerLabel: { titleLabel: Localizable, label: Localizable } | undefined, targetLabel: Localizable };
interface ReferenceStrings { referenceLabel: string, containerLabel: { titleLabel: string, label: string } | undefined, targetLabel: string };

@Component({
  selector: 'app-remove-link-confirmation-modal',
  styleUrls: ['./remove-link-confirmation-modal.component.scss'],
  template: `
    <div class="modal-header modal-header-warning">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="cancel_remove_link_link" (click)="cancel()"></i></a>
        <span translate>Confirm remove</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
          <p *ngIf="translated.length !== 1" translate>The following references are about to be completely removed</p>
          <p *ngIf="translated.length === 1" translate>The following reference is about to be completely removed</p>
          <div>
            <table>
              <tr><th translate>Reference type</th><th translate>Target container</th><th translate>Target</th></tr>
              <tr *ngFor="let ref of translated">
                <td>{{ref.referenceLabel}}</td><td>{{ref.containerLabel?.label}}</td><td>{{ref.targetLabel}}</td>
              </tr>
            </table>
          </div>
          <p class="question" translate>Are you sure that you want to continue?</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" id="remove_link_confirmation_yes_button" class="btn btn-secondary-action confirm" (click)="confirm()" translate>Yes</button>
      <button type="button" id="remove_link_confirmation_cancel_button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class RemoveLinkConfirmationModalComponent implements OnInit {

  @Input() references: ReferenceLabels[];
  translated: ReferenceStrings[];

  constructor(private modal: NgbActiveModal, private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.translated = this.references.map(localizables => {
      return {
        referenceLabel: this.languageService.translate(localizables.referenceLabel, true),
        containerLabel: localizables.containerLabel ? {
          titleLabel: this.languageService.translate(localizables.containerLabel.titleLabel, true),
          label: this.languageService.translate(localizables.containerLabel.label, false)
        } : undefined,
        targetLabel: this.languageService.translate(localizables.targetLabel, false)
      }
    }).sort(this.createComparator());
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }

  private createComparator(): (lhs: ReferenceStrings, rhs: ReferenceStrings) => number {
    const lc = (lhs: string, rhs: string) => lhs.localeCompare(rhs, this.languageService.language, { caseFirst: 'upper' });
    return (lhs: ReferenceStrings, rhs: ReferenceStrings) => {
      if (lhs.containerLabel && !rhs.containerLabel) {
        return 1;
      }
      if (!lhs.containerLabel && rhs.containerLabel) {
        return -1;
      }
      let ret = lc(lhs.referenceLabel, rhs.referenceLabel);
      if (!ret) {
        if (lhs.containerLabel && rhs.containerLabel) {
          // NOTE: Let us ignore title for now, as it is quite probably 'Vocabulary name'
          ret = lc(lhs.containerLabel.label, rhs.containerLabel.label);
        }
        if (!ret) {
          ret = lc(lhs.targetLabel, rhs.targetLabel);
        }
      }
      return ret;
    }
  }
}

@Injectable()
export class RemoveLinkConfirmationModalService {

  constructor(private modalService: ModalService) {
  }

  open(refs: ReferenceLabels[]): Promise<any> {
    const modalRef = this.modalService.open(RemoveLinkConfirmationModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as RemoveLinkConfirmationModalComponent;
    instance.references = refs;
    return modalRef.result;
  }
}
