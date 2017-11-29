import { Component } from '@angular/core';
import { LanguageService, Language } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { LoginModalService } from './login-modal.component';

@Component({
  selector: 'app-navigation-bar',
  styleUrls: ['./navigation-bar.component.scss'],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark bg-primary">

      <a class="navbar-brand" [routerLink]="['/']"><span>Sanasto- ja käsitevälineistö</span></a>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item" *ngFor="let language of languages">
          <a class="nav-link" (click)="setLanguage(language.code)">{{language.name}}</a>
        </li>
        <li class="nav-item" *ngIf="!isLoggedIn()">
          <a class="nav-link" (click)="logIn()" translate>Log In</a>
        </li>
        <li class="nav-item dropdown bg-primary" *ngIf="isLoggedIn()" placement="bottom-right" ngbDropdown>
          <a class="dropdown-toggle nav-link" ngbDropdownToggle>{{user.name}}</a>
          <div ngbDropdownMenu class="bg-light">
            <a class="dropdown-item" [routerLink]="['/userDetails']" translate>User details</a>
            <a class="dropdown-item" (click)="logOut()" translate>Logout</a>
          </div>
        </li>
      </ul>

    </nav>
  `
})
export class NavigationBarComponent {

  languages = [
    { code: 'fi' as Language, name: 'Suomeksi' },
    { code: 'en' as Language, name: 'In english' }
  ];

  constructor(private languageService: LanguageService,
              private userService: UserService,
              private loginModal: LoginModalService) {
  }

  setLanguage(language: Language) {
    this.languageService.language = language;
  }

  logIn() {
    this.loginModal.open();
  }

  logOut() {
    this.userService.logout();
  }

  get user() {
    return this.userService.user;
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
}
