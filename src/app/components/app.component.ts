import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <ng-template ngbModalContainer></ng-template>
    <app-navigation-bar></app-navigation-bar>
    <div class="container-fluid" [class.without-footer]="!showFooter">
      <app-breadcrumb [hidden]="!showBreadcrumb"></app-breadcrumb>
      <router-outlet></router-outlet>
    </div>
    <app-footer *ngIf="showFooter"></app-footer>
  `
})
export class AppComponent {

  showBreadcrumb: boolean;
  showFooter: boolean;

  constructor(locationService: LocationService) {

    locationService.location.subscribe(location => {
      this.showBreadcrumb = location.length > 1;
      this.showFooter = location.length === 1;
    });
  }
}
