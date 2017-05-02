import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <ng-template ngbModalContainer></ng-template>
    <navigation-bar></navigation-bar>
    <breadcrumb [hidden]="!showBreadcrumb"></breadcrumb>
    <router-outlet></router-outlet>
    <footer *ngIf="showFooter"></footer>
  `
})
export class AppComponent {

  showBreadcrumb: boolean;
  showFooter: boolean;

  constructor(locationService: LocationService) {
    locationService.location.subscribe(location => {
      this.showBreadcrumb = location.length > 1;
      this.showFooter = location.length === 1;
    })
  }
}
