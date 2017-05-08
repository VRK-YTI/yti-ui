import { Component } from '@angular/core';
import { ConceptHierarchyModel, ConceptViewModelService } from '../../services/concept.view.service';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IndexedConcept } from '../../services/elasticsearch.service';

@Component({
  selector: 'concept-hierarchy',
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
            [scrollWindow]="false"
            (scrolled)="onScrollDown()">
          <li *ngFor="let concept of model.topConcepts; trackBy: conceptIdentity">
            <concept-hierarchy-node [concept]="concept"></concept-hierarchy-node>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptHierarchyComponent {

  model: ConceptHierarchyModel;

  constructor(private userService: UserService,
              private router: Router,
              private conceptViewModel: ConceptViewModelService) {

    this.model = conceptViewModel.conceptHierarchy;
  }

  conceptIdentity(index: number, item: IndexedConcept) {
    return item.id + item.modified.toISOString();
  }

  onScrollDown() {
    this.model.loadConcepts();
  }

  canAddConcept() {
    return this.userService.isLoggedIn();
  }

  addConcept() {
    this.router.navigate(['/concepts', this.conceptViewModel.graphId, 'concept', uuid()]);
  }
}
