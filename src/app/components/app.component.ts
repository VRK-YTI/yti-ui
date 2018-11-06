import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'app/services/location.service';
import { ConfigurationService } from '../services/configuration.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div *ngIf="!ready" class="loading-indicator">
      <app-ajax-loading-indicator *ngIf="!configurationError"></app-ajax-loading-indicator>
      <span *ngIf="configurationError" class="error" translate>Cannot load application configuration</span>
    </div>
    <ng-container *ngIf="ready">
      <ng-template ngbModalContainer></ng-template>
      <app-navigation-bar></app-navigation-bar>
      <div class="container-fluid" [class.without-footer]="!showFooter">
        <app-breadcrumb [location]="location" [linkActive]="true" [refreshPath]="['re']"></app-breadcrumb>
        <router-outlet></router-outlet>
      </div>
      <app-footer [title]="'Controlled Vocabularies' | translate"
                  id="app_navigate_to_info"
                  (informationClick)="navigateToInformation()" *ngIf="showFooter"></app-footer>
    </ng-container>
  `
})
export class AppComponent {

  showFooter: boolean;
  ready: boolean = false;
  configurationError: boolean = false;

  constructor(private languageService: LanguageService, // To be able to translate configuration error message
              private locationService: LocationService,
              private configurationService: ConfigurationService,
              private router: Router) {

    locationService.showFooter.subscribe(showFooter => {
      this.showFooter = showFooter;
    });

    configurationService.configurationPromise
      .then(_cfg => this.ready = true)
      .catch(_error => this.configurationError = true);
  }

  get location() {
    return this.locationService.location;
  }

  navigateToInformation() {
    this.router.navigate(['/information']);
  }
}
