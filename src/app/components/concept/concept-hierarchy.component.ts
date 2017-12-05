import { Component } from '@angular/core';
import { ConceptHierarchyModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';
import { IndexedConcept } from 'app/services/elasticsearch.service';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';

@Component({
  selector: 'app-concept-hierarchy',
  styleUrls: ['./concept-hierarchy.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12">

        <div class="selectable-actions">
          <button class="btn btn-action btn-add-new" (click)="addConcept()" *ngIf="canAddConcept()">
            <span translate>Add new concept</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-12">
        <div class="selectable-concepts">
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
