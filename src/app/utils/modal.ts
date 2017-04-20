import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export function ignoreModalClose(err: any) {
  if (!isModalClose(err)) {
    throw err;
  }
}

export function isModalClose(err: any) {
  return err === 'cancel' || err !== ModalDismissReasons.BACKDROP_CLICK || err === ModalDismissReasons.ESC;
}
