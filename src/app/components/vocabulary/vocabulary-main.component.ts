import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ConceptViewModelService } from '../../services/concept.view.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ConceptsComponent } from '../concept/concepts.component';
import { VocabularyComponent } from './vocabulary.component';
import { ConfirmationModalService } from 'yti-common-ui/components/confirmation-modal.component';
import { ignoreModalClose } from 'yti-common-ui/utils/modal';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { requireDefined } from 'yti-common-ui/utils/object';
import { ImportVocabularyModalService } from './import-vocabulary-modal.component';
import { AuthorizationManager } from '../../services/authorization-manager.sevice';
import { MessagingService } from '../../services/messaging-service';
import { ErrorModalService } from 'yti-common-ui/components/error-modal.component';
import { ConfigurationService } from '../../services/configuration.service';
import { UserService } from 'yti-common-ui/services/user.service';

@Component({
  selector: 'app-vocabulary-main',
  styleUrls: ['./vocabulary-main.component.scss'],
  providers: [ConceptViewModelService],
  template: `
    <div class="content-box">
      <div *ngIf="vocabulary">
        <div class="header">
          <div class="row">
            <div class="nameButtonRow col-12">
              <h2 id="vocabulary_main_label"><span class="mr-4">{{vocabulary!.label | translateValue}}</span></h2>
              <div *ngIf="hasSubscription" class="subscription">
                <span class="subscription-icon icon-bell"
                      ngbTooltip="{{ 'You will receive an email notification when this resource changes.' | translate }}"></span>
              </div>
              <app-filter-language class="nameButtonRowButton" [(ngModel)]="filterLanguage"
                                   [languages]="filterLanguages"></app-filter-language>
              <div *ngIf="showMenu" ngbDropdown class="d-inline-block float-right ml-2" placement="bottom-right">
                <button class="btn btn-action" id="codeSchemeDropdown" ngbDropdownToggle translate>Choose action</button>
                <div ngbDropdownMenu aria-labelledby="codeSchemeDropdown">
                  <button id="add_subscription_button"
                          *ngIf="canAddSubscription"
                          type="button"
                          class="dropdown-item"
                          (click)="addSubscription()"
                          translate>Add email subscription</button>
                  <button id="delete_subscription_button"
                          *ngIf="canRemoveSubscription"
                          type="button"
                          class="dropdown-item"
                          (click)="removeSubscription()"
                          translate>Remove email subscription</button>
                  <button id="vocabulary_import_button"
                          *ngIf="canImport"
                          type="button"
                          class="dropdown-item"
                          (click)="selectFile()"
                          translate>Import concepts</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="informationRow col-12">
              <app-status class="status" [status]="vocabulary!.status"></app-status>
              <span class="inRowTitle"><span translate>Information domain</span>:</span>
              <span class="information-domains">
                <span class="badge badge-light" *ngFor="let domain of vocabulary!.groups">
                  {{domain.label | translateValue:true}}
                </span>
              </span>
              <span class="inRowTitle"><span translate>Organization</span>:</span>
              <ul class="organizations dot-separated-list">
                <li class="organization" *ngFor="let contributor of vocabulary!.contributors">
                  {{contributor.label | translateValue:true}}
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="descriptionRow col-12">
              <app-expandable-text [text]="vocabulary!.description | translateValue:true" [rows]="3"></app-expandable-text>
            </div>
          </div>
        </div>
        <ngb-tabset #tabs (tabChange)="onTabChange($event)">
          <ngb-tab id="conceptsTab" [title]="'Concepts' | translate">
            <ng-template ngbTabContent>
              <app-concepts #conceptsComponent></app-concepts>
            </ng-template>
          </ngb-tab>
          <ngb-tab id="terminologyTab" [title]="'Terminology details' | translate">
            <ng-template ngbTabContent>
              <app-vocabulary #terminologyComponent></app-vocabulary>
              <div class="bottom-hack-border"></div>
              <div class="bottom-hack-padding"></div>
            </ng-template>
          </ngb-tab>
        </ngb-tabset>
      </div>
    </div>
  `
})
export class VocabularyMainComponent implements OnDestroy {
  @ViewChild('tabs') tabs: NgbTabset;
  @ViewChild('conceptsComponent') conceptsComponent: ConceptsComponent;
  @ViewChild('terminologyComponent') terminologyComponent: VocabularyComponent;
  private graphId: string;
  private subscriptions: Subscription[] = [];
  private hasSubscription: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              public viewModel: ConceptViewModelService,
              private confirmationModalService: ConfirmationModalService,
              private importVocabularyModal: ImportVocabularyModalService,
              private authorizationManager: AuthorizationManager,
              private languageService: LanguageService,
              private messagingService: MessagingService,
              private errorModalService: ErrorModalService,
              private configurationService: ConfigurationService,
              private userService: UserService) {

    this.subscriptions.push(this.router.events.subscribe(event => {
      if (this.tabs && this.tabs.activeId !== 'conceptsTab' && event instanceof NavigationEnd) {
        // NOTE: Currently all routes lead to conceptsTab
        this.tabs.select('conceptsTab');
      }
    }));

    this.subscriptions.push(this.route.params.subscribe(params => {
      const conceptQuery = this.route.snapshot.queryParams['q'];
      this.graphId = params['graphId'];
      this.viewModel.initializeVocabulary(this.graphId, (conceptQuery && typeof conceptQuery === 'string') ? conceptQuery : undefined);
      this.checkSubscription();
    }));
  }

  get vocabulary() {
    return this.viewModel.vocabulary;
  }

  get filterLanguage() {
    return this.languageService.filterLanguage;
  }

  set filterLanguage(lang: string) {
    this.languageService.filterLanguage = lang;
  }

  get filterLanguages() {
    return this.viewModel.languages;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  showMenu() {
    return this.canSubscribe || this.canImport;
  }

  get canSubscribe(): boolean {

    return this.configurationService.isMessagingEnabled && !this.userService.user.anonymous;
  }

  get canImport(): boolean {
    if (!this.vocabulary) {
      return false;
    }

    return !this.isEditing() && this.authorizationManager.canEdit(this.vocabulary);
  }

  get canAddSubscription(): boolean {

    if (this.vocabulary) {
      return this.configurationService.isMessagingEnabled && !this.userService.user.anonymous && !this.hasSubscription;
    }
    return false;
  }

  get canRemoveSubscription(): boolean {

    if (this.vocabulary) {
      return this.configurationService.isMessagingEnabled && !this.userService.user.anonymous && this.hasSubscription;
    }
    return false;
  }

  isEditing(): boolean {
    return (this.conceptsComponent && this.conceptsComponent.isEditing()) || (this.terminologyComponent && this.terminologyComponent.isEditing());
  }

  selectFile() {
    this.importVocabularyModal.open(requireDefined(this.vocabulary))
      .then(() => this.viewModel.refreshConcepts(), ignoreModalClose)
  }

  onTabChange(event: NgbTabChangeEvent) {
    if ((this.terminologyComponent && this.terminologyComponent.isEditing()) ||
      (this.conceptsComponent && this.conceptsComponent.isEditing())) {
      event.preventDefault();
      this.confirmationModalService.openEditInProgress().then(() => {
        (this.conceptsComponent || this.terminologyComponent).cancelEditing();
        this.tabs.select(event.nextId);
      }, ignoreModalClose);
    }
  }

  addSubscription() {

    if (this.vocabulary && this.vocabulary.uri) {
      const vocabularyUri = this.vocabulary.uri;
      this.confirmationModalService.open('ADD EMAIL SUBSCRIPTION TO RESOURCE REGARDING CHANGES?', undefined, '')
        .then(() => {
          this.messagingService.addSubscription(vocabularyUri, 'codelist').subscribe(success => {
            if (success) {
              this.hasSubscription = true;
            } else {
              this.hasSubscription = false;
              this.errorModalService.open('Submit error', 'Adding subscription failed.', null);
            }
          });
        }, ignoreModalClose);
    }
  }

  removeSubscription() {

    if (this.vocabulary && this.vocabulary.uri) {
      const vocabularyUri = this.vocabulary.uri;
      this.confirmationModalService.open('REMOVE EMAIL SUBSCRIPTION TO RESOURCE?', undefined, '')
        .then(() => {
          this.messagingService.deleteSubscription(vocabularyUri).subscribe(success => {
            if (success) {
              this.hasSubscription = false;
            } else {
              this.hasSubscription = true;
              this.errorModalService.open('Submit error', 'Subscription deletion failed.', null);
            }
          });
        }, ignoreModalClose);
    }
  }


  checkSubscription() {

    if (this.vocabulary && this.vocabulary.uri) {
      const vocabularyUri = this.vocabulary.uri;
      if (this.configurationService.isMessagingEnabled && !this.userService.user.anonymous) {
        this.messagingService.getSubscription(vocabularyUri).subscribe(resource => {
          if (resource) {
            this.hasSubscription = true;
          } else {
            this.hasSubscription = false;
          }
        });
      }
    }
  }
}
