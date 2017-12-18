import { Component } from '@angular/core';
import { Language, LanguageService } from 'app/services/language.service';
import { UserService } from 'yti-common-ui/services/user.service';
import { LoginModalService } from 'yti-common-ui/components/login-modal.component';
import { TermedService } from '../../services/termed.service';

@Component({
  selector: 'app-navigation-bar',
  styleUrls: ['./navigation-bar.component.scss'],
  template: `
    <nav class="navbar navbar-expand-md navbar-light">

      <a class="navbar-brand" [routerLink]="['/']"><span>Sanastot</span></a>

      <ul class="navbar-nav ml-auto">

        <li *ngIf="fakeableUsers.length > 0" class="nav-item dropdown" ngbDropdown>
          <a class="nav-link" ngbDropdownToggle translate>Impersonate user</a>
          <div ngbDropdownMenu>
            <a class="dropdown-item" *ngFor="let user of fakeableUsers" (click)="fakeUser(user.email)">
              {{user.firstName}} {{user.lastName}}
            </a>
          </div>
        </li>
        
        <li class="nav-item" *ngIf="!isLoggedIn()">
          <a class="nav-link" (click)="logIn()" translate>LOG IN</a>
        </li>
        
        <li class="nav-item logged-in" *ngIf="isLoggedIn()">
          <span>{{user.name}}</span>
          <a class="nav-link" (click)="logOut()" translate>LOG OUT</a>
        </li>
        
        <li class="nav-item dropdown" placement="bottom-right" ngbDropdown>
          <a class="dropdown-toggle nav-link btn btn-language" ngbDropdownToggle>{{language.toUpperCase()}}</a>
          <div ngbDropdownMenu>
            <a *ngFor="let availableLanguage of availableLanguages"
               class="dropdown-item"
               [class.active]="availableLanguage.code === language"
               (click)="language = availableLanguage.code">
              <span>{{availableLanguage.name}}</span>
            </a>
          </div>
        </li>

        <li class="nav-item dropdown" placement="bottom-right" ngbDropdown>
          <a class="nav-link btn-menu" ngbDropdownToggle>
            <app-menu></app-menu>
          </a>
          <div ngbDropdownMenu>
            <a class="dropdown-item" *ngIf="isLoggedIn()" (click)="logOut()">
              <i class="fa fa-sign-out"></i>
              <span translate>LOG OUT</span>
            </a>
            <a class="dropdown-item" *ngIf="!isLoggedIn()" (click)="logIn()">
              <i class="fa fa-sign-in"></i>
              <span translate>LOG IN</span>
            </a>
            <div class="dropdown-divider" [hidden]="noMenuItemsAvailable"></div>
            <a class="dropdown-item"
               *ngIf="isLoggedIn()"
               [routerLink]="['/userDetails']" translate>User details</a>
            <a class="dropdown-item"
               *ngIf="isUserAdmin()"
               href="{{groupManagementUrl}}" target="_blank" translate>Group management service</a>
          </div>
        </li>
      </ul>
    </nav>
  `
})
export class NavigationBarComponent {

  availableLanguages = [
    { code: 'fi' as Language, name: 'Suomeksi (FI)' },
    { code: 'sv' as Language, name: 'På svenska (SV)' },
    { code: 'en' as Language, name: 'In English (EN)' }
  ];

  fakeableUsers: { email: string, firstName: string, lastName: string }[] = [];

  groupManagementUrl: string;

  constructor(private languageService: LanguageService,
              private userService: UserService,
              private loginModal: LoginModalService,
              termedService: TermedService) {

    termedService.getFakeableUsers().subscribe(users => {
      this.fakeableUsers = users;
    });

    termedService.getGroupManagementUrl().subscribe(url => {
      this.groupManagementUrl = url;
    });
  }

  fakeUser(userEmail: string) {
    this.userService.updateLoggedInUser(userEmail);
  }

  get noMenuItemsAvailable() {
    return !this.userService.isLoggedIn();
  }

  set language(language: Language) {
    this.languageService.language = language;
  }

  get language(): Language {
    return this.languageService.language;
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

  isUserAdmin() {
    return this.user.isAdminInAnyOrganization();
  }
}
