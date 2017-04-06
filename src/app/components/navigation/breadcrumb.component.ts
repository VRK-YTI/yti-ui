import { Component } from '@angular/core';
import { LocationService, Location } from '../../services/location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'breadcrumb',
  styleUrls: ['./breadcrumb.component.scss'],
  template: `
    <ol class="breadcrumb">
      <li class="breadcrumb-item" [class.active]="active" *ngFor="let breadcrumb of location | async; let active = last">
        <a *ngIf="!active && breadcrumb.route" [routerLink]="breadcrumb.route">
          <span *ngIf="breadcrumb.localizationKey">{{breadcrumb.localizationKey | translate}}</span>
          <span *ngIf="!breadcrumb.localizationKey">{{breadcrumb.label | translateValue}}</span>
        </a>
        <span *ngIf="active || !breadcrumb.route">
          <span *ngIf="breadcrumb.localizationKey">{{breadcrumb.localizationKey | translate}}</span>
          <span *ngIf="!breadcrumb.localizationKey">{{breadcrumb.label | translateValue}}</span>
        </span>
      </li>
    </ol>
  `
})
export class BreadcrumbComponent {

  location: Observable<Location[]>;

  constructor(locationService: LocationService) {
    this.location = locationService.location;
  }
}
