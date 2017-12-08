import { AfterViewInit, Component, ElementRef, Injectable, Input, Renderer, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupNode } from 'app/entities/node';
import { BehaviorSubject, Observable } from 'rxjs';
import { TermedService } from 'app/services/termed.service';
import { LanguageService } from 'app/services/language.service';
import { contains } from 'yti-common-ui/utils/array';

@Injectable()
export class SearchGroupModalService {

  constructor(private modalService: NgbModal) {
  }

  open(restrictGroupIds: string[]): Promise<GroupNode> {
    const modalRef = this.modalService.open(SearchGroupModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as SearchGroupModalComponent;
    instance.restricts = restrictGroupIds;
    return modalRef.result;
  }
}

@Component({
  selector: 'app-search-group-modal',
  styleUrls: ['./search-group-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Choose group</span>
      </h4>
    </div>
    <div class="modal-body full-height">

      <div class="row mb-2">
        <div class="col-12">

          <div class="input-group input-group-lg input-group-search">
            <input #searchInput type="text" class="form-control" placeholder="{{'Search group' | translate}}"
                   [(ngModel)]="search"/>
          </div>

        </div>
      </div>

      <div class="row full-height">
        <div class="col-12">
          <div class="content-box">
            <div class="search-results">
              <div class="search-result"
                   *ngFor="let group of searchResults$ | async; let last = last"
                   (click)="select(group)">
                <div class="content" [class.last]="last">
                  <span class="title" [innerHTML]="group.label | translateValue:true"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">

      <button type="button"
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

    const initialSearch = this.search$.take(1);
    const debouncedSearch = this.search$.skip(1).debounceTime(500);

    this.searchResults$ = Observable.combineLatest(termedService.getGroupList(), initialSearch.concat(debouncedSearch))
      .do(() => this.loading = false)
      .map(([groups, search]) => {
        return groups.filter(group => {
          const label = languageService.translate(group.label, true);
          const searchMatches = !search || label.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          const isNotRestricted = !contains(this.restricts, group.id);
          return searchMatches && isNotRestricted;
        });
      });
  }

  select(group: GroupNode) {
    this.modal.close(group);
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
