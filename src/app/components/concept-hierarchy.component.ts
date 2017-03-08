import { Component, Input, OnInit } from '@angular/core';
import { Node } from '../entities/node';
import { TermedService } from '../services/termed.service';
import { LanguageService } from '../services/language.service';
import { comparingLocalizable } from '../utils/comparator';

@Component({
  selector: 'concept-hierarchy',
  styleUrls: ['./concept-hierarchy.component.scss'],
  template: `
    <div class="row">
      <div class="col-lg-12 tree">
        <ul>
          <li *ngFor="let concept of topConcepts">
            <concept-hierarchy-node [concept]="concept"></concept-hierarchy-node>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ConceptHierarchyComponent implements OnInit {

  @Input() graphId: string;

  topConcepts: Node<'Concept'>[];

  constructor(private termedService: TermedService, private languageService: LanguageService) {
  }

  ngOnInit() {
    this.termedService.getRootConceptList(this.graphId).subscribe(concepts => {
      this.topConcepts = concepts.sort(comparingLocalizable<Node<'Concept'>>(this.languageService, concept => concept.label));
    });
  }
}
