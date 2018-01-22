import { Component } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-information-about-service',
  styleUrls: ['./information-about-service.component.scss'],
  templateUrl: './information-about-service.component.html',
})

export class InformationAboutServiceComponent {

  constructor(private locationService: LocationService) {
    locationService.atInformationAboutService();
  }
}
