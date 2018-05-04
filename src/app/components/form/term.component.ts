import { Component, Input } from '@angular/core';
import { FormNode, FormProperty } from 'app/services/form-state';
import { EditableService } from 'app/services/editable.service';

@Component({
  selector: 'app-term',
  template: `
    <div class="row">
      <div class="col-md-12" [class.col-xl-6]="multiColumn" *ngFor="let property of properties">
        <app-property id="{{property.name + '_' + filterLanguage}}" [property]="property.value" [filterLanguage]="filterLanguage"></app-property>
      </div>
    </div>
  `
})
export class TermComponent {

  @Input() multiColumn: boolean;
  @Input() term: FormNode;
  @Input() filterLanguage: string;

  constructor(private editableService: EditableService) {
  }

  get showEmpty() {
    return this.editableService.editing;
  }

  get properties() {

    const hasContent = (field: FormProperty) =>
      this.filterLanguage ? field.hasContentForLanguage(this.filterLanguage)
                          : !field.valueEmpty;

    return this.term.properties.filter(f => this.showEmpty || hasContent(f.value));
  }
}
