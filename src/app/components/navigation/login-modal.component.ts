import { AfterViewInit, Component, ElementRef, Injectable, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCredentials } from '../../services/termed-http.service';
import { TermedService } from '../../services/termed.service';
import { UserService } from '../../services/user.service';

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
    <form>
      <div class="modal-header">
        <h4 class="modal-title">
          <a><i class="fa fa-times" (click)="cancel()"></i></a>
          <span translate>Login</span>
        </h4>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-12">
            
            <div class="form-group">
              <label for="username" translate>Username</label>
              <input #usernameInput type="text" id="username" name="username" class="form-control" autofocus [(ngModel)]="username" />
              
              <label for="password" translate>Password</label>
              <input type="password" id="username" name="password" class="form-control" [(ngModel)]="password" />
            </div>
            
          </div>
        </div>
      </div>
      <div class="modal-footer">
  
        <div class="alert alert-danger" style="display: inline; padding: 6px; margin: 0 5px 0 0;" role="alert" *ngIf="authenticationError">
          <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
          <span translate>Login failed</span>
        </div>
        
        <button type="button" class="btn btn-secondary cancel" (click)="cancel()" translate>Cancel</button>
        <button type="submit" class="btn btn-default confirm" (click)="confirm()" translate>Log In</button>
      </div>
    </form>
  `
})
export class LoginModalComponent implements AfterViewInit {

  @ViewChild('usernameInput')
  usernameInput: ElementRef;

  username: string;
  password: string;
  authenticationError = false;

  constructor(private modal: NgbActiveModal,
              private termedService: TermedService,
              private userService: UserService,
              private renderer: Renderer) {
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {

    const credentials: UserCredentials = {
      username: this.username,
      password: this.password
    };

    this.termedService.checkCredentials(credentials).subscribe(authenticated => {
      if (authenticated) {
        this.userService.login({
          name: credentials.username,
          username: credentials.username,
          password: credentials.password
        });
        this.modal.close();
      } else {
        this.authenticationError = true;
      }
    });
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.usernameInput.nativeElement, 'focus');
  }
}
