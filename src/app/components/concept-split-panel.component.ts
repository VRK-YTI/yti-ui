import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {EditableService} from "../services/editable.service";
import {ConceptViewModelService} from "../services/concept.view.service";

@Component({
  selector: 'concept-split-panel',
  styleUrls: ['./concept-split-panel.component.scss'],
  template: `
      <div class="container-fluid">
        <ajax-loading-indicator *ngIf="loading"></ajax-loading-indicator>
        <div [hidden]="loading"></div>
        
        <div class="bottom">
          <div class="row">
            <div class="col-lg-6">
              <router-outlet></router-outlet>
            </div>
            <div class="col-lg-6">
                <concept-network></concept-network>
            </div>
          </div>
        </div>
      </div>
   `
})

export class ConceptSplitPanelComponent {

  constructor(private route: ActivatedRoute,
              private viewModel: ConceptViewModelService) {

    route.params.subscribe(params => {
      this.viewModel.initializeRootConcept(params['rootConceptId']);
    });

  }
}