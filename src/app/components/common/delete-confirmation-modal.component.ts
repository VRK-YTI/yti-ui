import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Node } from '../../entities/node';
import { ReferenceMeta } from '../../entities/meta';
import { flatten } from '../../utils/array';
import { MetaModelService } from '../../services/meta-model.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DeleteConfirmationModalService {

  constructor(private modalService: NgbModal) {
  }

  open(node: Node<any>): Promise<any> {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as DeleteConfirmationModalComponent;
    instance.node = node;
    return modalRef.result;
  }
}

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
export class DeleteConfirmationModalComponent implements OnInit {

  @Input() node: Node<any>;

  references: Reference[] = [];

  constructor(private modal: NgbActiveModal,
              private metaModelService: MetaModelService) {
  }

  ngOnInit(): void {
    Observable.forkJoin(Object.values(this.node.referrers)
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
