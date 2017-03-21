import { Component, Input } from '@angular/core';
import { Node } from '../entities/node';
import { ConceptViewModelService } from '../services/concept.view.service';
import { Router } from '@angular/router';

@Component({
  selector: 'concept-hierarchy-node',
  styleUrls: ['./concept-hierarchy-node.component.scss'],
  template: `
    <div [class.selection]="selected" (click)="navigate()">
      <i [hidden]="!hasChildren() || expanded" class="fa fa-plus-square-o" (click)="expand()"></i>
      <i [hidden]="!hasChildren() || collapsed" class="fa fa-minus-square-o" (click)="collapse()"></i>
      <span>{{concept.label | translateValue}}</span>
    </div>
    
    <ul *ngIf="expanded && children">
      <li *ngFor="let child of children">
        <concept-hierarchy-node [concept]="child"></concept-hierarchy-node>
      </li>
    </ul>
  `
})
export class ConceptHierarchyNodeComponent {

  @Input() concept: Node<'Concept'>;
  collapsed = true;
  children: Node<'Concept'>[];

  constructor(private conceptViewModel: ConceptViewModelService,
              private router: Router) {
  }

  navigate() {
    this.router.navigate(['/concepts', this.concept.graphId, 'concept', this.concept.id]);
  }

  get selected() {
    return this.conceptViewModel.conceptId === this.concept.id;
  }

  get expanded() {
    return !this.collapsed;
  }

  hasChildren() {
    const narrower = this.concept.referrers['broader'];
    return narrower && narrower.length > 0;
  }

  collapse() {
    this.collapsed = true;
  }

  expand() {
    this.collapsed = false;

    if (!this.children) {
      this.conceptViewModel.getNarrowerConcepts(this.concept)
        .subscribe(concepts => this.children = concepts);
    }
  }
}
