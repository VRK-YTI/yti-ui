import { Component } from '@angular/core';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'concept-hierarchy',
  styleUrls: ['./concept-hierarchy.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12 tree">

        <div class="actions">
          <button class="button btn-default btn-add-new" (click)="addConcept()">
            <i class="fa fa-plus"></i>
            <span translate>Add concept</span>
          </button>
        </div>
        
        <ul>
          <li *ngFor="let concept of topConcepts | async">
            <concept-hierarchy-node [concept]="concept"></concept-hierarchy-node>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptHierarchyComponent {

  constructor(private router: Router,
              private conceptViewModel: ConceptViewModelService) {
  }

  get topConcepts() {
    return this.conceptViewModel.topConcepts$;
  }

  addConcept() {
    this.router.navigate(['/concepts', this.conceptViewModel.graphId, 'concept', uuid()]);
  }
}
