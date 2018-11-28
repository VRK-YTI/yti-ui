import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptNode } from 'app/entities/node';
import { FormNode, FormReferenceLiteral } from 'app/services/form-state';
import { Options } from 'yti-common-ui/components/dropdown.component';
import { LanguageService } from 'app/services/language.service';
import { ModalService } from 'app/services/modal.service';
import { labelNameToResourceIdIdentifier } from 'yti-common-ui/utils/resource';

@Component({
  selector: 'app-select-concept-reference-modal',
  styleUrls: ['./select-concept-reference-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="select_concept_cancel_link" (click)="cancel()"></i></a>
        <span translate>Choose reference type</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
          
          <p translate>Selected concept is not yet formally referenced. Choose the reference type.</p>
          
          <div class="form-group">
            <label for="status" translate>Reference type</label>
            <app-dropdown [(ngModel)]="selection" id="select_concept_reference_dropdown" [options]="referenceOptions"></app-dropdown>
          </div>
          
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" id="select_concept_confirm_button" class="btn btn-action confirm" (click)="confirm()" translate>Select reference</button>
      <button type="button" id="select_concept_cancel_button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class SelectConceptReferenceModalComponent implements OnInit {

  @Input() formNode: FormNode;

  selection: FormReferenceLiteral<ConceptNode>;
  referenceOptions: Options<FormReferenceLiteral<ConceptNode>>;

  constructor(public modal: NgbActiveModal,
              private languageService: LanguageService) {
  }

  ngOnInit(): void {

    this.referenceOptions = this.formNode.references
      .filter(ref => ref.value.targetType === 'Concept')
      .map(ref => {

        const value = ref.value as FormReferenceLiteral<ConceptNode>;

        return {
          value: value,
          name: () => this.languageService.translate(value.label, true),
          idIdentifier: () => labelNameToResourceIdIdentifier(this.languageService.translate(value.label, true))
        }
      });

    if (this.formNode.hasRelatedConcepts()) {
      this.selection = this.formNode.relatedConcepts;
    } else {
      this.selection = this.referenceOptions[0].value!;
    }
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close(this.selection);
  }
}

@Injectable()
export class SelectConceptReferenceModalService {

  constructor(private modalService: ModalService) {
  }

  open(formNode: FormNode): Promise<FormReferenceLiteral<ConceptNode>> {
    const modalRef = this.modalService.open(SelectConceptReferenceModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as SelectConceptReferenceModalComponent;
    instance.formNode = formNode;
    return modalRef.result;
  }
}
