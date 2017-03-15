import {OnInit, Input, Component} from "@angular/core";
import {Node} from '../entities/node';
import {ActivatedRoute} from "@angular/router";
import {TermedService} from "../services/termed.service";
import {Observable} from "rxjs";
import {LocationService} from "../services/location.service";
import {EditableService} from "../services/editable.service";
import {ConceptsComponent} from "./concepts.component";

@Component({
  selector: 'concept-split-panel',
  styleUrls: ['./concept-split-panel.component.scss'],
  providers: [EditableService],
  template: `
      <div class="container-fluid">
        <ajax-loading-indicator *ngIf="loading"></ajax-loading-indicator>
        <div [hidden]="loading">
        
        <div class="row">
          <div class="col-12">
            Component split panel
          </div>
        </div>
      </div>
      
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
   `
})

export class ConceptSplitPanelComponent implements OnInit {

  rootConceptId: string;
  rootConcept: Node<'Concept'>;
  rootConcept$: Observable<Node<'Concept'>>;

  constructor(private route: ActivatedRoute,
              private termedService: TermedService,
              private locationService: LocationService,
              private conceptsComponent: ConceptsComponent) {

  }

  public ngOnInit(): void {
    const rootConceptId$ = this.route.params.map(params => params['rootConceptId'] as string);
    rootConceptId$.subscribe(rootConceptId => {
      this.rootConceptId = rootConceptId
      this.rootConcept$ = this.termedService.getConcept(this.graphId, rootConceptId);
    });

    // this.rootConcept$ = rootConceptId$.switchMap(rootConceptId => {
    //   console.log(rootConceptId);
    //   return this.termedService.getConcept(this.conceptsComponent.graphId, rootConceptId)
    //       .publishReplay()
    //       .refCount();
    // });

    Observable.combineLatest(this.conceptsComponent.conceptScheme$, this.rootConcept$)
      .subscribe(([conceptScheme, rootConcept]) => {
        if (conceptScheme && rootConcept) {
          this.locationService.atRootConcept(conceptScheme, rootConcept);
          this.rootConcept = rootConcept.clone();
        }
      });

    // this.rootConcept$.subscribe(rootConcept => {
    //   if (rootConcept) {
    //     this.locationService.atRootConcept(this.conceptsComponent.conceptScheme, rootConcept);
    //     this.rootConcept = rootConcept.clone();
    //   }
    // });
  }

  get graphId() {
    return this.conceptsComponent.graphId;
  }
}