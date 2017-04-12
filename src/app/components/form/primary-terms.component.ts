import { Component, Input, OnInit } from '@angular/core';
import { Reference, TermNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';

@Component({
  selector: 'primary-terms',
  styleUrls: ['./primary-terms.component.scss'],
  template: `              
    <ngb-accordion [activeIds]="openTermLanguages">
      <ngb-panel [id]="term.language" *ngFor="let term of nonEmptyTerms">
        <template ngbPanelTitle>
          <div class="language">{{term.language | uppercase}}</div> 
          <div class="localization">{{term.value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </template>
        <template ngbPanelContent>
          <div class="row">
            <div class="col-md-12" [class.col-xl-6]="multiColumn && property.multiColumn" *ngFor="let property of term | properties: showEmpty">
              <property [value]="property"></property>
            </div>
          </div>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class PrimaryTermsComponent implements OnInit {

  @Input('value') termReference: Reference<TermNode>;
  @Input() multiColumn = false;

  openTermLanguages: string[] = [];

  constructor(private editableService: EditableService) {
  }

  ngOnInit() {
    this.editableService.editing$.subscribe(editing => {
      if (editing) {
        this.openTermLanguages = this.termReference.languages.slice();
      } else {
        this.openTermLanguages = [];
      }
    });
  }

  get nonEmptyTerms() {
    if (this.showEmpty) {
      return this.termReference.values;
    } else {
      return this.termReference.values.filter(term => !term.empty!);
    }
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
