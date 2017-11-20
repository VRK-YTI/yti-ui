import { AfterViewInit, Component, ElementRef, Injectable, Input, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationNode } from '../../entities/node';
import { BehaviorSubject, Observable } from 'rxjs';
import { TermedService } from '../../services/termed.service';
import { LanguageService } from '../../services/language.service';
import { contains } from '../../utils/array';
import { isDefined } from '../../utils/object';

@Injectable()
export class SearchOrganizationModalService {

  constructor(private modalService: NgbModal) {
  }

  open(restrictOrganizationIds: string[], allowOnlyOrganizationIds: string[]|null): Promise<OrganizationNode> {
    const modalRef = this.modalService.open(SearchOrganizationModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as SearchOrganizationModalComponent;
    instance.restrictOrganizationIds = restrictOrganizationIds;
    instance.allowOnlyOrganizationIds = allowOnlyOrganizationIds;
    return modalRef.result;
  }
}

@Component({
  selector: 'app-search-organization-modal',
  styleUrls: ['./search-organization-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Choose organization</span>
      </h4>
    </div>
    <div class="modal-body full-height">
      <div class="row">
        <div class="col-md-6">

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput type="text" class="form-control" placeholder="{{'Search organization...' | translate}}"
                   [(ngModel)]="search"/>
          </div>
          
        </div>
        <div class="col-md-6">
          <div class="search-results">
            <div class="search-result"
                 *ngFor="let organization of searchResults$ | async" 
                 (click)="select(organization)">
              <h6 [innerHTML]="organization.label | translateValue"></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">

      <button type="button" 
              class="btn btn-secondary cancel" 
              (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class SearchOrganizationModalComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() restrictOrganizationIds: string[];
  @Input() allowOnlyOrganizationIds: string[]|null;

  searchResults$: Observable<OrganizationNode[]>;

  search$ = new BehaviorSubject('');
  loading = false;

  constructor(public modal: NgbActiveModal,
              termedService: TermedService,
              languageService: LanguageService,
              private renderer: Renderer) {

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);

    this.searchResults$ = Observable.combineLatest(termedService.getOrganizationList(), initialSearch.concat(debouncedSearch))
      .do(() => this.loading = false)
      .map(([organizations, search]) => {
        return organizations.filter(organization => {
          const label = languageService.translate(organization.label, false);
          const searchMatches = !search || label.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          const isNotRestricted = !contains(this.restrictOrganizationIds, organization.id);
          const isAllowed = !isDefined(this.allowOnlyOrganizationIds) || contains(this.allowOnlyOrganizationIds, organization.id);
          return searchMatches && isNotRestricted && isAllowed;
        });
      });
  }

  select(organization: OrganizationNode) {
    this.modal.close(organization);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  get search() {
    return this.search$.getValue();
  }

  set search(value: string) {
    this.search$.next(value);
  }

  cancel() {
    this.modal.dismiss('cancel');
  }
}
