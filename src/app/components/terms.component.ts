import { Component, Input, OnInit } from '@angular/core';
import { Reference, TermNode } from '../entities/node';
import { EditableService } from '../services/editable.service';

@Component({
  selector: 'terms',
  styleUrls: ['./terms.component.scss'],
  template: `              
    <ngb-accordion [activeIds]="openTermLanguages">
      <ngb-panel [id]="term.language" *ngFor="let term of nonEmptyTerms">
        <template ngbPanelTitle>
          <div class="language">{{term.language | uppercase}}</div> 
          <div class="localization">{{term.value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
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

  @Input('value') termReference: Reference<TermNode>;
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
    if (this.editableService.editing) {
      return this.termReference.values;
    } else {
      return this.termReference.values.filter(term => !term.empty!);
    }
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
