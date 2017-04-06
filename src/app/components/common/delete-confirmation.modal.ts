import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Node } from '../../entities/node';
import { ReferenceMeta } from '../../entities/meta';
import { getOrCreate } from '../../utils/map';

@Injectable()
export class DeleteConfirmationModalService {

  constructor(private modalService: NgbModal) {
  }

  open(node: Node<any>): Promise<any> {
    const modalRef = this.modalService.open(DeleteConfirmationModal, { size: 'sm' });
    const instance = modalRef.componentInstance as DeleteConfirmationModal;
    instance.node = node;
    return modalRef.result;
  }
}

type Reference = {
  meta: ReferenceMeta
  nodes: Node<any>[];
}

@Component({
  selector: 'delete-confirmation-modal',
  styleUrls: ['./delete-confirmation.modal.scss'],
  template: `
    <div class="modal-header modal-header-warning">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
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
                {{reference.meta.label | translateValue}}
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
      <button type="button" class="btn btn-secondary confirm" (click)="confirm()" translate>Yes</button>
      <button type="button" class="btn btn-default cancel" (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class DeleteConfirmationModal implements OnInit {

  @Input() node: Node<any>;

  references: Reference[] = [];

  constructor(private modal: NgbActiveModal) {
  }

  ngOnInit() {

    const references = new Map<ReferenceMeta, Node<any>[]>();

    for (const [referenceId, nodes] of Object.entries(this.node.referrers)) {
      for (const node of nodes) {
        const meta = node.meta.references.find(ref => ref.id === referenceId);
        getOrCreate(references, meta, () => []).push(node);
      }
    }

    for (const [meta, nodes] of Array.from(references.entries())) {
      this.references.push({meta, nodes});
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  confirm() {
    this.modal.close();
  }
}
