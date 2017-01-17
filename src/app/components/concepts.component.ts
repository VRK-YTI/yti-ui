import { Component, OnInit } from '@angular/core';
import { TermedService, ConceptListItem } from '../services/termed.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'concepts',
  styleUrls: ['./concepts.component.scss'],
  template: `
    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1 translate>Concepts</h1>
          </div>        
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <ul>
            <li *ngFor="let concept of concepts | async">
              {{concept.label | translateValue}}          
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  `
})
export class ConceptsComponent implements OnInit {

  concepts: Observable<ConceptListItem[]>;

  constructor(private route: ActivatedRoute, private termedService: TermedService) {
  }

  ngOnInit() {
    this.concepts = this.route.params.switchMap(params => this.termedService.getConceptListItems(params['graphId']));
  }
}
