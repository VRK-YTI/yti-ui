import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <navigation-bar></navigation-bar>
    <breadcrumb [hidden]="!showBreadcrumb"></breadcrumb>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  showBreadcrumb: boolean;

  constructor(locationService: LocationService) {
    locationService.location.subscribe(location => {
      this.showBreadcrumb = location.length > 1;
    })
  }
}
