import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptHierarchyModel, ConceptViewModelService } from 'app/services/concept.view.service';
import { IndexedConcept } from 'app/services/elasticsearch.service';

@Component({
  selector: 'app-concept-hierarchy-node',
  styleUrls: ['./concept-hierarchy-node.component.scss'],
  template: `
    
    <i [hidden]="!hasChildren() || expanded" class="fa fa-plus-square-o" id="expand_concept_hierarchy_node" (click)="expand()"></i>
    <i [hidden]="!hasChildren() || collapsed" class="fa fa-minus-square-o" id="collapse_concept_hierarchy_node" (click)="collapse()"></i>
      
    <div class="text" [class.selection]="selected" (click)="navigate()">
      <span>{{concept.label | translateValue}}</span>
    </div>
    
    <ul *ngIf="expanded && children">
      <li *ngFor="let child of children | async">
        <app-concept-hierarchy-node [concept]="child" id="{{child.id+'_concept_hierarchy_node'}}"></app-concept-hierarchy-node>
      </li>
    </ul>
  `
})
export class ConceptHierarchyNodeComponent {

  @Input() concept: IndexedConcept;
  model: ConceptHierarchyModel;

  constructor(private conceptViewModel: ConceptViewModelService,
              private router: Router) {

    this.model = conceptViewModel.conceptHierarchy;
  }

  navigate() {
    this.router.navigate(['/concepts', this.concept.vocabulary.id, 'concept', this.concept.id]);
  }

  get selected() {
    return this.conceptViewModel.conceptId === this.concept.id;
  }

  get expanded() {
    return this.model.isExpanded(this.concept);
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
}
