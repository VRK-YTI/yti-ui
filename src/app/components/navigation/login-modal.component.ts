import { Component, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare const window: Window;

@Injectable()
export class LoginModalService {

  constructor(private modalService: NgbModal) {
  }

  open(): Promise<any> {
    return this.modalService.open(LoginModalComponent, { size: 'sm' }).result
  }
}

@Component({
  selector: 'app-login-modal',
  styleUrls: ['./login-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Login</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
          <p translate>eDuuni information</p>
          <p translate>Login information</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="login()" translate>Log In</button>
      <button type="button" class="btn btn-default" (click)="register()" translate>Register</button>
    </div>
  `
})
export class LoginModalComponent {

  constructor(private modal: NgbActiveModal) {
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  login() {
    const currentUrl = window.location.href;
    window.location.href = `/Shibboleth.sso/Login?target=${encodeURIComponent(currentUrl)}`;
  }

  register() {
    window.open('http://id.eduuni.fi/signup', '_blank');
  }
}
