import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'app/services/location.service';

const versionInfo = require('!raw-loader!../../version.txt');

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <ng-template ngbModalContainer></ng-template>
    <app-navigation-bar></app-navigation-bar>
    <div class="container-fluid" [class.without-footer]="!showFooter">
      <app-breadcrumb [location]="location" [linkActive]="true" [refreshPath]="['re']"></app-breadcrumb>
      <router-outlet></router-outlet>
    </div>
    <app-footer [title]="'Terminologies' | translate"
                id="app_navigate_to_info"
                [showLicenseIcon]="true"
                [version]="version"
                (informationClick)="navigateToInformation()"
                *ngIf="showFooter"></app-footer>
  `
})
export class AppComponent {

  showFooter: boolean;
  version: string;

  constructor(private locationService: LocationService,
              private router: Router) {

    locationService.showFooter.subscribe(showFooter => {
      this.showFooter = showFooter;
    });

    this.version = versionInfo;
  }

  get location() {
    return this.locationService.location;
  }

  navigateToInformation() {
    this.router.navigate(['/information']);
  }
}
