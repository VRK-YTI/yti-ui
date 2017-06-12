import { Component, Input, OnInit } from '@angular/core';
import { EditableService } from '../../services/editable.service';
import { FormReferenceTerm } from '../../services/form-state';

@Component({
  selector: 'primary-terms',
  styleUrls: ['./primary-terms.component.scss'],
  template: `              
    <ngb-accordion [activeIds]="openTermLanguages">
      <ngb-panel [id]="node.language" *ngFor="let node of children">
        <ng-template ngbPanelTitle>
          <div class="language">{{node.language | uppercase}}</div> 
          <div class="localization">{{node.formNode.prefLabelProperty[0].value}} <accordion-chevron class="pull-right"></accordion-chevron></div>
        </ng-template>
        <ng-template ngbPanelContent>
          <div class="row">
            <div class="col-md-12" [class.col-xl-6]="multiColumn && child.property.multiColumn" *ngFor="let child of node.formNode.properties">
              <property [id]="child.name" [property]="child.property"></property>
            </div>
          </div>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class PrimaryTermsComponent implements OnInit {

  @Input() reference: FormReferenceTerm;
  @Input() unsaved: boolean;
  @Input() multiColumn = false;

  openTermLanguages: string[] = [];

  constructor(private editableService: EditableService) {
  }

  ngOnInit() {
    this.editableService.editing$.subscribe(editing => {
      if (this.unsaved && editing) {
        this.openTermLanguages = this.reference.languages.slice();
      }
    });
  }

  get children() {
    if (this.showEmpty) {
      return this.reference.children;
    } else {
      return this.reference.children.filter(child => child.formNode.hasNonEmptyPrefLabel);
    }
  }

  get showEmpty() {
    return this.editableService.editing;
  }
}
