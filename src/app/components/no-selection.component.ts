import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { ConceptsComponent } from './concepts.component';

@Component({
  selector: 'no-selection',
  template: ''
})
export class NoSelectionComponent implements OnInit {

  constructor(private locationService: LocationService, private conceptsComponent: ConceptsComponent) {
  }

  ngOnInit() {
    this.conceptsComponent.conceptScheme$.subscribe(conceptScheme => {
      this.locationService.atConceptScheme(conceptScheme);
    });
  }
}
