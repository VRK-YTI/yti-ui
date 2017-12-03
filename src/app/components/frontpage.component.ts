import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-frontpage',
  styleUrls: ['./frontpage.component.scss'],
  template: `
    <app-vocabularies></app-vocabularies>
  `
})
export class FrontpageComponent {


  constructor(locationService: LocationService) {
    locationService.atFrontPage();
  }
}
