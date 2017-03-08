import { Component, Input, OnInit } from '@angular/core';
import { Node } from '../entities/node';
import { TermedService } from '../services/termed.service';

@Component({
  selector: 'concept-hierarchy-node',
  styleUrls: ['./concept-hierarchy-node.component.scss'],
  template: `
    <i [hidden]="!hasChildren() || expanded" class="fa fa-plus-square-o" (click)="expand()"></i>
    <i [hidden]="!hasChildren() || collapsed" class="fa fa-minus-square-o" (click)="collapse()"></i>
    <a [routerLink]="['/concepts', concept.graphId, 'concept', concept.id]">{{concept.label | translateValue}}</a>
    
    <ul *ngIf="expanded && children">
      <li *ngFor="let child of children">
        <concept-hierarchy-node [concept]="child"></concept-hierarchy-node>
      </li>
    </ul>
  `
})
export class ConceptHierarchyNodeComponent implements OnInit {

  @Input() concept: Node<'Concept'>;
  collapsed = true;
  children: Node<'Concept'>[];

  constructor(private termedService: TermedService) {
  }

  ngOnInit() {
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
      this.termedService.getNarrowerConcepts(this.concept.graphId, this.concept.id).subscribe(concepts => this.children = concepts);
    }
  }
}
