import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from 'app/services/language.service';
import { UserService } from 'yti-common-ui/services/user.service';
import { LoginModalService } from 'yti-common-ui/components/login-modal.component';
import { TermedService } from '../../services/termed.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-navigation-bar',
  styleUrls: ['./navigation-bar.component.scss'],
  template: `
    <nav class="navbar navbar-expand-md navbar-light">

      <a id="main_page_link" class="navbar-brand" [routerLink]="['/']">
        <app-logo></app-logo>
        <span translate>Controlled Vocabularies</span>
        <span>{{environmentIdentifier}}</span>
      </a>

      <ul class="navbar-nav ml-auto">

        <li *ngIf="fakeableUsers.length > 0" class="nav-item dropdown" ngbDropdown>
          <a class="nav-link" id="fakeable_user_dropdown" ngbDropdownToggle translate>Impersonate user</a>
          <div ngbDropdownMenu>
            <a class="dropdown-item" *ngFor="let user of fakeableUsers" (click)="fakeUser(user.email)"
               id="{{user.email + '_fakeable_user_link'}}">
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
              <i class="fas fa-sign-out-alt"></i>
              <span translate>LOG OUT</span>
            </a>
            <a class="dropdown-item" *ngIf="!isLoggedIn()" id="login_dropdown_link" (click)="logIn()">
              <i class="fas fa-sign-in-alt"></i>
              <span translate>LOG IN</span>
            </a>
            <div class="dropdown-divider" [hidden]="noMenuItemsAvailable"></div>
            <a class="dropdown-item"
               id="user_details_link"
               *ngIf="isLoggedIn()"
               [routerLink]="['/userDetails']" translate>User details</a>
            <a id="navigation_interoperability_platform_link"
               class="dropdown-item"
               href="https://yhteentoimiva.suomi.fi/" target="_blank">yhteentoimiva.suomi.fi</a>
            <a id="navigation_reference_data_link"
               class="dropdown-item"
               [href]="codeListUrl" target="_blank" translate>Suomi.fi Reference Data</a>
            <a id="navigation_data_vocabularies_link"
               class="dropdown-item"
               [href]="dataModelUrl" target="_blank" translate>Suomi.fi Data Vocabularies</a>
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
  codeListUrl: string;
  dataModelUrl: string;
  environmentIdentifier: string;

  constructor(private languageService: LanguageService,
              private userService: UserService,
              private loginModal: LoginModalService,
              private termedService: TermedService,
              private configurationService: ConfigurationService) {

    this.termedService.getFakeableUsers().subscribe(users => {
      this.fakeableUsers = users;
    });

    const env = this.configurationService.environment;
    this.environmentIdentifier = env !== 'prod' ? ' - ' + env.toUpperCase() : '';
    this.groupManagementUrl = this.configurationService.groupManagementUrl;
    this.codeListUrl = this.configurationService.codeListUrl;
    this.dataModelUrl = this.configurationService.dataModelUrl;
  }

  get noMenuItemsAvailable() {
    return !this.userService.isLoggedIn();
  }

  get language(): Language {
    return this.languageService.language;
  }

  set language(language: Language) {
    this.languageService.language = language;
  }

  get user() {
    return this.userService.user;
  }

  fakeUser(userEmail: string) {
    this.userService.updateLoggedInUser(userEmail);
  }

  logIn() {
    this.loginModal.open();
  }

  logOut() {
    this.userService.logout();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  showGroupManagementUrl() {
    return this.user.superuser || this.user.isAdminInAnyOrganization();
  }
}
