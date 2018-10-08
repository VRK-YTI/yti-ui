import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Node } from 'app/entities/node';
import { ReferenceMeta } from 'app/entities/meta';
import { flatten } from 'yti-common-ui/utils/array';
import { MetaModelService } from 'app/services/meta-model.service';
import { forkJoin } from 'rxjs';
import { ModalService } from 'app/services/modal.service';

interface Reference {
  meta: ReferenceMeta;
  nodes: Node<any>[];
}

@Component({
  selector: 'app-delete-confirmation-modal',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  template: `
    <div class="modal-header modal-header-warning">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="cancel_delete_link" (click)="cancel()"></i></a>
        <span translate>Confirm remove</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">

          <div *ngIf="references.length > 0">
            <p translate>Following items are referring to the deleted item</p>
  
            <ul>
              <li *ngFor="let reference of references">
                {{reference.meta.label | translateValue:true}}
                <ul>
                  <li *ngFor="let node of reference.nodes">
                    {{node.label | translateValue}}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          
          <span translate>Are you sure that you want to remove?</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" id="delete_confirmation_yes_button" class="btn btn-secondary-action confirm" (click)="confirm()" translate>Yes</button>
      <button type="button" id="delete_confirmation_cancel_button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class DeleteConfirmationModalComponent implements OnInit {

  @Input() node: Node<any>;

  references: Reference[] = [];

  constructor(private modal: NgbActiveModal,
              private metaModelService: MetaModelService) {
  }

  ngOnInit(): void {
    forkJoin(this.node.getAllReferrers()
      .map(referrer => this.metaModelService.getReferrersByMeta<Node<any>>(referrer))
    ).subscribe(referrers => this.references = flatten(referrers));
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }
}

@Injectable()
export class DeleteConfirmationModalService {

  constructor(private modalService: ModalService) {
  }

  open(node: Node<any>): Promise<any> {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as DeleteConfirmationModalComponent;
    instance.node = node;
    return modalRef.result;
  }
}
