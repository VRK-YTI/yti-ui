import { Component } from '@angular/core';
import { LocationService } from 'app/services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <ng-template ngbModalContainer></ng-template>
    <app-navigation-bar></app-navigation-bar>
    <div class="container-fluid" [class.without-footer]="!showFooter">
      <app-breadcrumb [location]="location" [hidden]="!showBreadcrumb"></app-breadcrumb>
      <router-outlet></router-outlet>
    </div>
    <app-footer [title]="'Sanastot'"
                id="app_navigate_to_info"
                (informationClick)="navigateToInformation()" *ngIf="showFooter"></app-footer>
  `
})
export class AppComponent {

  showBreadcrumb: boolean;
  showFooter: boolean;

  constructor(private locationService: LocationService,
              private router: Router) {

    locationService.location.subscribe(location => {
      this.showBreadcrumb = location.length > 1;
    });

    locationService.showFooter.subscribe(showFooter => {
      this.showFooter = showFooter;
    });
  }

  get location() {
    return this.locationService.location;
  }

  navigateToInformation() {
    this.router.navigate(['/information']);
  }
}
