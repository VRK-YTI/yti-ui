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

      <div class="navbar-header">
        <div class="navbar-fluid logo">
          <a class="navbar-brand" [routerLink]="['/']">
            <div class="logocontainer">
          <span>
            <svg id="flagimage" class="applogo">
              <g>
                <path fill="#003479" d="M53,0H2C0.9,0,0,0.9,0,2v51c0,1.1,0.9,2,2,2h51c1.1,0,2-0.9,2-2V2C55,0.9,54.1,0,53,0z"></path>
                <g>
                  <path fill="#FFFFFF" d="M14,20v-5c0-1.1,0.9-2,2-2h5v7"></path>
                  <path fill="#FFFFFF" d="M14,27h7v14c0,0.5-0.4,1-1,1h-5c-0.6,0-1-0.5-1-1"></path>
                  <path fill="#FFFFFF" d="M28,13h13c0.5,0,1,0.4,1,1v6H28"></path>
                  <path fill="#FFFFFF" d="M41,34H28v-7h14v6C42,33.6,41.6,34,41,34z"></path>
                </g>
              </g>
            </svg>
          </span>
              <span class="apptitle">Sanastot</span>
            </div>
          </a>
        </div>
      </div>

      <ul class="navbar-nav ml-auto">

        <li *ngIf="fakeableUsers.length > 0" class="nav-item dropdown" ngbDropdown>
          <a class="nav-link" id="fakeable_user_dropdown" ngbDropdownToggle translate>Impersonate user</a>
          <div ngbDropdownMenu>
            <a class="dropdown-item" *ngFor="let user of fakeableUsers" (click)="fakeUser(user.email)" id="{{user.email + '_fakeable_user_link'}}">
              {{user.firstName}} {{user.lastName}}
            </a>
          </div>
        </li>
        
        <li class="nav-item" *ngIf="!isLoggedIn()">
          <a class="nav-link" id="login_link" (click)="logIn()" translate>LOG IN</a>
        </li>
        
        <li class="nav-item logged-in" *ngIf="isLoggedIn()">
          <span>{{user.name}}</span>
          <a class="nav-link" id="logout_link" (click)="logOut()" translate>LOG OUT</a>
        </li>
        
        <li class="nav-item dropdown" placement="bottom-right" ngbDropdown>
          <a class="dropdown-toggle nav-link btn btn-language" id="language_dropdown_link" ngbDropdownToggle>{{language.toUpperCase()}}</a>
          <div ngbDropdownMenu>
            <a *ngFor="let availableLanguage of availableLanguages"
               id="{{availableLanguage.code + '_language_selection_link'}}"
               class="dropdown-item"
               [class.active]="availableLanguage.code === language"
               (click)="language = availableLanguage.code">
              <span>{{availableLanguage.name}}</span>
            </a>
          </div>
        </li>

        <li class="nav-item dropdown" placement="bottom-right" ngbDropdown>
          <a class="nav-link btn-menu" id="nav_item_dropdown_link" ngbDropdownToggle>
            <app-menu></app-menu>
          </a>
          <div ngbDropdownMenu>
            <a class="dropdown-item" *ngIf="isLoggedIn()" id="logout_dropdown_link" (click)="logOut()">
              <i class="fa fa-sign-out"></i>
              <span translate>LOG OUT</span>
            </a>
            <a class="dropdown-item" *ngIf="!isLoggedIn()" id="login_dropdown_link" (click)="logIn()">
              <i class="fa fa-sign-in"></i>
              <span translate>LOG IN</span>
            </a>
            <div class="dropdown-divider" [hidden]="noMenuItemsAvailable"></div>
            <a class="dropdown-item"
               id="user_details_link"
               *ngIf="isLoggedIn()"
               [routerLink]="['/userDetails']" translate>User details</a>
            <a class="dropdown-item"
               id="groupmanagement_link"
               *ngIf="showGroupManagementUrl()"
               [href]="groupManagementUrl" target="_blank" translate>User right management</a>
          </div>
        </li>
      </ul>
    </nav>
  `
})
export class NavigationBarComponent {

  availableLanguages = [
    { code: 'fi' as Language, name: 'Suomeksi (FI)' },
    // { code: 'sv' as Language, name: 'På svenska (SV)' },
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

  showGroupManagementUrl() {
    return this.user.superuser || this.user.isAdminInAnyOrganization();
  }
}
