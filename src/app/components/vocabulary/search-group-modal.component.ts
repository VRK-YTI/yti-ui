import { AfterViewInit, Component, ElementRef, Injectable, Input, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupNode } from 'app/entities/node';
import { BehaviorSubject, combineLatest, concat, Observable } from 'rxjs';
import { debounceTime, map, skip, take, tap } from 'rxjs/operators';
import { TermedService } from 'app/services/termed.service';
import { LanguageService } from 'app/services/language.service';
import { contains } from 'yti-common-ui/utils/array';
import { ModalService } from 'yti-common-ui/services/modal.service';
import {comparingLocalizable} from 'yti-common-ui/utils/comparator';

@Component({
  selector: 'app-search-group-modal',
  styleUrls: ['./search-group-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" id="cancel_search_domain_link" (click)="cancel()"></i></a>
        <span translate>Choose information domain</span>
      </h4>
    </div>
    <div class="modal-body full-height">

      <div class="row mb-2">
        <div class="col-12">

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput type="text" id="search_domain_link" class="form-control"
                   placeholder="{{'Search information domain' | translate}}"
                   [(ngModel)]="search"/>
          </div>

        </div>
      </div>

      <div class="row full-height">
        <div class="col-12">
          <div class="content-box">
            <div class="search-results">
              <div class="search-result"
                   *ngFor="let domain of searchResults$ | async; let last = last"
                   [id]="domain.idIdentifier + '_domain_select'"
                   (click)="select(domain)">
                <div class="content" [class.last]="last">
                  <span class="title" [innerHTML]="domain.label | translateValue:true"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">

      <button type="button"
              id="cancel_search_domain_button"
              class="btn btn-link cancel"
              (click)="cancel()" translate>Cancel</button>
    </div>
  `
})
export class SearchGroupModalComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() restricts: string[];

  searchResults$: Observable<GroupNode[]>;

  search$ = new BehaviorSubject('');
  loading = false;

  constructor(public modal: NgbActiveModal,
              termedService: TermedService,
              languageService: LanguageService,
              private renderer: Renderer) {

    const initialSearch = this.search$.pipe(take(1));
    const debouncedSearch = this.search$.pipe(skip(1), debounceTime(500));

    this.searchResults$ = combineLatest(termedService.getGroupList(), concat(initialSearch, debouncedSearch))
      .pipe(
        tap(() => this.loading = false),
        map(([informationDomains, search]) => {
          return informationDomains.filter(domain => {
            const label = languageService.translate(domain.label, true);
            const searchMatches = !search || label.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            const isNotRestricted = !contains(this.restricts, domain.id);
            return searchMatches && isNotRestricted;
          })
            .sort(comparingLocalizable<GroupNode>(languageService, node => node.label));
        }));
  }

  get search() {
    return this.search$.getValue();
  }

  set search(value: string) {
    this.search$.next(value);
  }

  select(informationDomain: GroupNode) {
    this.modal.close(informationDomain);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  cancel() {
    this.modal.dismiss('cancel');
  }
}

@Injectable()
export class SearchGroupModalService {

  constructor(private modalService: ModalService) {
  }

  open(restrictDomainIds: string[]): Promise<GroupNode> {
    const modalRef = this.modalService.open(SearchGroupModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as SearchGroupModalComponent;
    instance.restricts = restrictDomainIds;
    return modalRef.result;
  }
}
