import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Injectable } from '@angular/core';
import { remove } from 'yti-common-ui/utils/array';

// https://github.com/ng-bootstrap/ng-bootstrap/issues/1297
// https://github.com/ng-bootstrap/ng-bootstrap/issues/1963
// https://github.com/ng-bootstrap/ng-bootstrap/issues/643
// TODO: Deprecate when modal stack is supported by the ng-bootstrap library
@Injectable()
export class ModalService {

  private stack: NgbModalRef[] = [];

  constructor(private modalService: NgbModal) {
  }

  isModalOpen(): boolean {
    return this.stack.length > 0;
  }

  closeAllModals() {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const modalRef = this.stack[i];
      modalRef.dismiss('cancel');
    }
  }

  open(content: any, options?: NgbModalOptions): NgbModalRef {
    const modalRef =  this.modalService.open(content, options);

    this.stack.push(modalRef);

    const cleanFromStack = () => remove(this.stack, modalRef);

    modalRef.result.then(cleanFromStack, cleanFromStack);

    return modalRef;
  }
}
