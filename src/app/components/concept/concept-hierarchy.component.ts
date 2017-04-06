import { Component } from '@angular/core';
import { ConceptViewModelService } from '../../services/concept.view.service';

@Component({
  selector: 'concept-hierarchy',
  styleUrls: ['./concept-hierarchy.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12 tree">
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

  constructor(private conceptViewModel: ConceptViewModelService) {
  }

  get topConcepts() {
    return this.conceptViewModel.topConcepts$;
  }
}
