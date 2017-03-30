import { Component, Input, OnInit } from '@angular/core';
import { Reference } from '../entities/node';
import { EditableService } from '../services/editable.service';
import { Node } from '../entities/node';
import { Localization } from '../entities/localization';

@Component({
  selector: 'terms',
  styleUrls: ['./terms.component.scss'],
  template: `              
    <ngb-accordion [activeIds]="openTermLanguages">
      <ngb-panel [id]="languageOfTerm(term)" *ngFor="let term of nonEmptyTerms">
        <template ngbPanelTitle>
          <div class="language">{{languageOfTerm(term).toUpperCase()}}</div> 
          <div class="localization">{{localizationOfTerm(term).value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </template>
        <template ngbPanelContent>
          <div class="row" [class.primary-term]="primary">
            <div class="col-md-12 col-xl-6" [class.col-xl-6]="multiColumn" *ngFor="let property of term | properties: showEmpty">
              <property [value]="property"></property>
            </div>
          </div>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class TermsComponent implements OnInit {

  @Input('value') termReference: Reference;
  @Input() multiColumn = false;
  @Input() primary = false;

  openTermLanguages: string[] = [];

  constructor(private editableService: EditableService) {
  }

  ngOnInit() {
    this.editableService.editing$.subscribe(editing => {
      if (this.primary) {
        if (editing) {
          this.openTermLanguages = this.termReference.languages.slice();
        } else {
          this.openTermLanguages = [];
        }
      }
    });
  }

  get nonEmptyTerms() {
    return this.termReference.values.filter(term => this.editableService.editing || !!this.localizationOfTerm(term).value.trim());
  }

  languageOfTerm(term: Node<'Term'>): string {
    return this.localizationOfTerm(term).lang;
  }

  localizationOfTerm(term: Node<'Term'>): Localization {
    return term.properties['prefLabel'].value[0] as Localization;
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
