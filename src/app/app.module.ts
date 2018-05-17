import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ResolveEnd, Router, RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'app/components/app.component';
import { TermedService } from 'app/services/termed.service';
import { NavigationBarComponent } from 'app/components/navigation/navigation-bar.component';
import { TermedHttp } from 'app/services/termed-http.service';
import { VocabulariesComponent } from 'app/components/vocabulary/vocabularies.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from 'ng2-translate';
import { Observable } from 'rxjs';
import { LanguageService } from 'app/services/language.service';
import { ConceptsComponent } from 'app/components/concept/concepts.component';
import { LocationService } from 'app/services/location.service';
import { ConceptComponent } from 'app/components/concept/concept.component';
import { TranslateSearchValuePipe } from 'app/pipes/translate-search-value.pipe';
import { LocalizedInputComponent } from 'app/components/form/localized-input.component';
import { MetaModelService } from 'app/services/meta-model.service';
import { PropertyComponent } from 'app/components/form/property.component';
import { ReferenceComponent } from 'app/components/form/reference.component';
import { NoSelectionComponent } from 'app/components/common/no-selection.component';
import { TimestampPipe } from 'app/pipes/timestamp.pipe';
import { SemanticTextLinksComponent, SemanticTextLinksElementComponent } from 'app/components/semantic-text/semantic-text-links.component';
import { ConceptNetworkComponent } from 'app/components/visualization/concept-network.component';
import { VocabularyComponent } from 'app/components/vocabulary/vocabulary.component';
import { LiteralInputComponent } from 'app/components/form/literal-input.component';
import { ErrorMessagesComponent } from 'app/components/form/error-messages.component';
import { EditableButtonsComponent } from 'app/components/form/editable-buttons.component';
import { ElasticSearchService } from 'app/services/elasticsearch.service';
import { SemanticTextPlainComponent, SemanticTextPlainElementComponent } from 'app/components/semantic-text/semantic-text-plain.component';
import { ConceptListComponent } from 'app/components/concept/concept-list.component';
import { ConceptHierarchyComponent } from 'app/components/concept/concept-hierarchy.component';
import { ConceptHierarchyNodeComponent } from 'app/components/concept/concept-hierarchy-node.component';
import { StatusInputComponent } from 'app/components/form/status-input.component';
import { MetaInformationComponent } from 'app/components/common/meta-information.component';
import { FloatDirective } from 'app/directives/float.directive';
import { ConceptReferenceInputComponent } from 'app/components/concept/concept-reference-input.component';
import { SearchConceptModalComponent, SearchConceptModalService } from 'app/components/concept/search-concept-modal.component';
import { ConceptFormComponent } from 'app/components/concept/concept-form.component';
import { DividerComponent } from 'app/components/common/divider.component';
import { SessionService } from 'app/services/session.service';
import { DeleteConfirmationModalComponent, DeleteConfirmationModalService } from 'app/components/common/delete-confirmation-modal.component';
import { CollectionComponent } from 'app/components/collection/collection.component';
import { CollectionListComponent } from 'app/components/collection/collection-list.component';
import { ConfirmCancelEditGuard } from 'app/components/common/edit.guard';
import { NewVocabularyComponent } from 'app/components/vocabulary/new-vocabulary.component';
import { VocabularyFormComponent } from 'app/components/vocabulary/vocabulary-form.component';
import { GroupInputComponent } from 'app/components/vocabulary/group-input.component';
import { OrganizationInputComponent } from 'app/components/vocabulary/organization-input.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConceptLinkReferenceInputComponent, ConceptLinkReferencePopoverComponent } from 'app/components/concept/concept-link-reference-input.component';
import { SemanticTextInputComponent } from 'app/components/form/semantic-text-input.component';
import { SemanticTextInputLinkPopoverComponent, SemanticTextInputUnlinkPopoverComponent } from 'app/components/form/semantic-text-input-popover.component';
import { SelectConceptReferenceModalComponent, SelectConceptReferenceModalService } from 'app/components/concept/select-concept-reference-modal.component';
import { FrontpageComponent } from 'app/components/frontpage.component';
import { LiteralListInputComponent } from 'app/components/form/literal-list-input.component';
import { TermsComponent } from 'app/components/form/terms.component';
import { TermComponent } from 'app/components/form/term.component';
import { LanguageInputComponent } from 'app/components/form/language-input.component';
import { FilterLanguageComponent } from 'app/components/form/filter-language.component';
import { ImportVocabularyModalComponent, ImportVocabularyModalService } from 'app/components/vocabulary/import-vocabulary-modal.component';
import { SearchOrganizationModalComponent, SearchOrganizationModalService } from 'app/components/vocabulary/search-organization-modal.component';
import { PrefixInputComponent } from 'app/components/concept/prefix-input.component';
import { SearchGroupModalComponent, SearchGroupModalService } from 'app/components/vocabulary/search-group-modal.component';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { UserDetailsComponent } from 'app/components/user-details.component';
import { StatusComponent } from 'yti-common-ui/components/status.component';
import { OrganizationFilterDropdownComponent } from 'app/components/common/organization-filter-dropdown.component';
import { VocabularyFilterDropdownComponent } from 'app/components/common/vocabulary-filter-dropdown.component';
import { StatusFilterDropdownComponent } from 'app/components/common/status-filter-dropdown.component';
import { YtiCommonModule, AUTHENTICATED_USER_ENDPOINT, LOCALIZER } from 'yti-common-ui';
import { InformationAboutServiceComponent } from 'app/components/information/information-about-service.component';
import { ModalService } from './services/modal.service';
import { DragSortableDirective, DragSortableItemDirective } from './directives/drag-sortable.directive';
import { apiUrl } from './config';

const localizations: { [lang: string]: string} = {
  fi: Object.assign({},
    require('json-loader!po-loader?format=mf!../../po/fi.po'),
    require('json-loader!po-loader?format=mf!yti-common-ui/po/fi.po')
  )
  ,
  en: Object.assign({},
    require('json-loader!po-loader?format=mf!../../po/en.po'),
    require('json-loader!po-loader?format=mf!yti-common-ui/po/en.po')
  )
};

export function resolveAuthenticatedUserEndpoint() {
  return `${apiUrl}/authenticated-user`;
}

export function createTranslateLoader(): TranslateLoader {
  return { getTranslation: (lang: string) => Observable.of(localizations[lang]) };
}

export function createMissingTranslationHandler(): MissingTranslationHandler {
  return {
    handle: (params: MissingTranslationHandlerParams) => {
      if (params.translateService.currentLang === 'en') {
        return params.key;
      } else {
        return '[MISSING]: ' + params.key;
      }
    }
  };
}

const appRoutes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'newVocabulary', component: NewVocabularyComponent },
  { path: 'concepts/:graphId', component: ConceptsComponent, canDeactivate: [ConfirmCancelEditGuard], children: [
      { path: '', component: NoSelectionComponent },
      { path: 'concept/:conceptId', component: ConceptComponent, canDeactivate: [ConfirmCancelEditGuard] },
      { path: 'collection/:collectionId', component: CollectionComponent, canDeactivate: [ConfirmCancelEditGuard] }
    ]},
  { path: 'userDetails', component: UserDetailsComponent },
  { path: 'information', component: InformationAboutServiceComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    FrontpageComponent,
    VocabulariesComponent,
    VocabularyComponent,
    ConceptsComponent,
    ConceptListComponent,
    ConceptHierarchyComponent,
    ConceptHierarchyNodeComponent,
    ConceptComponent,
    ConceptFormComponent,
    CollectionListComponent,
    CollectionComponent,
    NoSelectionComponent,
    PropertyComponent,
    ReferenceComponent,
    ConceptReferenceInputComponent,
    ConceptLinkReferenceInputComponent,
    ConceptLinkReferencePopoverComponent,
    TermsComponent,
    TermComponent,
    SemanticTextPlainComponent,
    SemanticTextPlainElementComponent,
    SemanticTextLinksComponent,
    SemanticTextLinksElementComponent,
    LiteralInputComponent,
    LiteralListInputComponent,
    StatusInputComponent,
    LocalizedInputComponent,
    LanguageInputComponent,
    ErrorMessagesComponent,
    EditableButtonsComponent,
    ConceptNetworkComponent,
    MetaInformationComponent,
    DividerComponent,
    NewVocabularyComponent,
    VocabularyFormComponent,
    GroupInputComponent,
    OrganizationInputComponent,
    SemanticTextInputComponent,
    SemanticTextInputLinkPopoverComponent,
    SemanticTextInputUnlinkPopoverComponent,
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    FloatDirective,
    TranslateSearchValuePipe,
    TimestampPipe,
    FilterLanguageComponent,
    ImportVocabularyModalComponent,
    PrefixInputComponent,
    UserDetailsComponent,
    StatusComponent,
    OrganizationFilterDropdownComponent,
    VocabularyFilterDropdownComponent,
    StatusFilterDropdownComponent,
    InformationAboutServiceComponent,
    DragSortableDirective,
    DragSortableItemDirective
  ],
  entryComponents: [
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    ImportVocabularyModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    InfiniteScrollModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({ provide: TranslateLoader, useFactory: createTranslateLoader }),
    YtiCommonModule
  ],
  providers: [
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
    { provide: LOCALIZER, useExisting: LanguageService },
    TermedHttp,
    TermedService,
    MetaModelService,
    { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler },
    LanguageService,
    LocationService,
    SearchConceptModalService,
    SearchOrganizationModalService,
    SearchGroupModalService,
    DeleteConfirmationModalService,
    SelectConceptReferenceModalService,
    SessionService,
    ElasticSearchService,
    ConfirmCancelEditGuard,
    AuthorizationManager,
    ImportVocabularyModalService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(router: Router,
              modalService: ModalService) {

    router.events.subscribe(event => {
      if (event instanceof ResolveEnd) {
        modalService.closeAllModals();
      }
    });
  }
}
