import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptHierarchyModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { IndexedConcept } from 'app/services/elasticsearch.service';

@Component({
  selector: 'app-concept-hierarchy-node',
  styleUrls: ['./concept-hierarchy-node.component.scss'],
  template: `
    
    <i [hidden]="!hasChildren() || expanded || loop" class="far fa-plus-square" [id]="concept.idIdentifier + '_expand_concept_hierarchy_node'" (click)="expand()"></i>
    <i [hidden]="!hasChildren() || collapsed || loop" class="far fa-minus-square" [id]="concept.idIdentifier + '_collapse_concept_hierarchy_node'" (click)="collapse()"></i>
    <i [hidden]="!loop" class="hierarchy-loop fa fa-retweet" [id]="concept.idIdentifier + '_concept_hierarchy_loop'"></i>
      
    <div [id]="concept.idIdentifier + '_concept_hierarchy_node'" class="text" [ngClass]="{'hierarchy-loop': loop}" [class.selection]="selected" (click)="navigate()">
      <span>{{concept.label | translateValue}}</span>
    </div>
    
    <ul *ngIf="expanded && children">
      <li *ngFor="let child of children | async">
        <app-concept-hierarchy-node [concept]="child" [parentIds]="path"></app-concept-hierarchy-node>
      </li>
    </ul>
  `
})
export class ConceptHierarchyNodeComponent {

  @Input() concept: IndexedConcept;
  @Input() parentIds: string[];
  model: ConceptHierarchyModel;

  constructor(private conceptViewModel: ConceptViewModelService,
              private router: Router) {

    this.model = conceptViewModel.conceptHierarchy;
  }

  navigate() {
    this.router.navigate(['/concepts', this.concept.vocabulary.id, 'concept', this.concept.id]);
  }

  get selected() {
    return this.conceptViewModel.resourceId === this.concept.id;
  }

  get expanded() {
    return !this.loop && this.model.isExpanded(this.concept);
  }

  get collapsed() {
    return !this.expanded;
  }

  hasChildren() {
    return this.concept.hasNarrower;
  }

  get children() {
    return this.model.getNarrowerConcepts(this.concept);
  }

  collapse() {
    this.model.collapse(this.concept);
  }

  expand() {
    this.model.expand(this.concept);
  }

  get path(): string[] {
    return [...this.parentIds, this.concept.id];
  }

  get loop() {
    return this.parentIds.indexOf(this.concept.id) >= 0;
  }
}
