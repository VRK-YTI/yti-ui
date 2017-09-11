import { Component } from '@angular/core';
import { LanguageService, Language } from '../../services/language.service';
import { UserService } from '../../services/user.service';
import { LoginModalService } from './login-modal.component';

@Component({
  selector: 'app-navigation-bar',
  styleUrls: ['./navigation-bar.component.scss'],
  template: `
    <nav class="navbar navbar-toggleable-md navbar-inverse bg-primary">

      <a class="navbar-brand" [routerLink]="['/']"><span>Sanasto- ja käsitevälineistö</span></a>
    
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" *ngFor="let language of languages">
            <a class="nav-link" (click)="setLanguage(language.code)">{{language.name}}</a>
          </li>
          <li class="nav-item" *ngIf="!isLoggedIn()">
            <a class="nav-link" (click)="logIn()" translate>Log In</a>
          </li>
          <li class="nav-item bg-inverse" *ngIf="isLoggedIn()" ngbDropdown>
            <a class="dropdown-toggle nav-link" ngbDropdownToggle>{{username}}</a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" (click)="logOut()" translate>Logout</a>
            </div>
          </li>
        </ul>
      </div>
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

  get username() {
    return this.userService.user!.name;
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
}
