import { AfterViewInit, Component, ElementRef, Injectable, Input, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationNode } from 'app/entities/node';
import { BehaviorSubject, combineLatest, Observable, concat } from 'rxjs';
import { debounceTime, map, skip, take, tap } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { LanguageService } from 'app/services/language.service';
import { contains } from 'yti-common-ui/utils/array';
import { isDefined } from 'yti-common-ui/utils/object';
import { ModalService } from 'app/services/modal.service';

@Injectable()
export class SearchOrganizationModalService {

  constructor(private modalService: ModalService) {
  }

  open(restrictOrganizationIds: string[], allowOnlyOrganizationIds: string[]|null): Promise<OrganizationNode> {
    const modalRef = this.modalService.open(SearchOrganizationModalComponent, { size: 'sm' });
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
        <a><i id="cancel_search_organization_link" class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Choose organization</span>
      </h4>
    </div>
    <div class="modal-body full-height">
      <div class="row mb-2">
        <div class="col-12">
          <div class="input-group input-group-lg input-group-search">
            <input #searchInput type="text" id="search_organization_link" class="form-control" placeholder="{{'Search organization' | translate}}"
                   [(ngModel)]="search"/>
          </div>
        </div>
      </div>
      <div class="row full-height">
        <div class="col-12">
          <div class="content-box">
            <div class="search-results">
              <div class="search-result"
                   *ngFor="let organization of searchResults$ | async; let last = last"
                   [id]="organization.getIdIdentifier(languageService) + '_organization_select'"
                   (click)="select(organization)">
                <div class="content" [class.last]="last">
                  <span class="title" [innerHTML]="organization.label | translateValue:true"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">

      <button type="button"
              id="cancel_search_organization_button"
              class="btn btn-link cancel"
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
              public languageService: LanguageService,
              private renderer: Renderer) {

    const initialSearch = this.search$.pipe(take(1));
    const debouncedSearch = this.search$.pipe(skip(1), debounceTime(500));

    this.searchResults$ = combineLatest(termedService.getOrganizationList(), concat(initialSearch, debouncedSearch))
      .pipe(
        tap(() => this.loading = false),
        map(([organizations, search]) => {
          return organizations.filter(organization => {
            const label = languageService.translate(organization.label, true);
            const searchMatches = !search || label.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            const isNotRestricted = !contains(this.restrictOrganizationIds, organization.id);
            const isAllowed = !isDefined(this.allowOnlyOrganizationIds) || contains(this.allowOnlyOrganizationIds, organization.id);
            return searchMatches && isNotRestricted && isAllowed;
          });
        }));
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
