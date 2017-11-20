import { Component } from '@angular/core';
import { ConceptHierarchyModel, ConceptViewModelService } from '../../services/concept.view.service';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';
import { IndexedConcept } from '../../services/elasticsearch.service';
import { AuthorizationManager } from '../../services/authorization-manager.sevice';

@Component({
  selector: 'app-concept-hierarchy',
  styleUrls: ['./concept-hierarchy.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12 tree">

        <div class="actions">
          <button class="button btn-default btn-add-new" (click)="addConcept()" *ngIf="canAddConcept()">
            <i class="fa fa-plus"></i>
            <span translate>Add concept</span>
          </button>
        </div>

        <ul [ngClass]="{'has-button': canAddConcept()}"
            infinite-scroll
            [infiniteScrollDistance]="2.5"
            [scrollWindow]="false"
            (scrolled)="onScrollDown()">
          <li *ngFor="let concept of model.topConcepts; trackBy: conceptIdentity">
            <app-concept-hierarchy-node [concept]="concept"></app-concept-hierarchy-node>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptHierarchyComponent {

  model: ConceptHierarchyModel;

  constructor(private router: Router,
              private conceptViewModel: ConceptViewModelService,
              private authorizationManager: AuthorizationManager) {

    this.model = conceptViewModel.conceptHierarchy;
  }

  conceptIdentity(index: number, item: IndexedConcept) {
    return item.id + item.modified.toISOString();
  }

  onScrollDown() {
    this.model.loadConcepts();
  }

  canAddConcept() {

    if (!this.conceptViewModel.vocabulary) {
      return false;
    }

    return this.authorizationManager.canAddConcept(this.conceptViewModel.vocabulary);
  }

  addConcept() {
    this.router.navigate(['/concepts', this.conceptViewModel.graphId, 'concept', uuid()]);
  }
}
