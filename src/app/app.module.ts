import { BrowserModule, Title } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResolveEnd, Route, Router, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'app/components/app.component';
import { TermedService } from 'app/services/termed.service';
import { NavigationBarComponent } from 'app/components/navigation/navigation-bar.component';
import { VocabulariesComponent } from 'app/components/vocabulary/vocabularies.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
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
import {
  DeleteConfirmationModalComponent,
  DeleteConfirmationModalService
} from 'app/components/common/delete-confirmation-modal.component';
import { CollectionComponent } from 'app/components/collection/collection.component';
import { CollectionListComponent } from 'app/components/collection/collection-list.component';
import { ConfirmCancelEditGuard } from 'app/components/common/edit.guard';
import { NewVocabularyComponent } from 'app/components/vocabulary/new-vocabulary.component';
import { VocabularyFormComponent } from 'app/components/vocabulary/vocabulary-form.component';
import { GroupInputComponent } from 'app/components/vocabulary/group-input.component';
import { OrganizationInputComponent } from 'app/components/vocabulary/organization-input.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  ConceptLinkReferenceInputComponent,
  ConceptLinkReferencePopoverComponent
} from 'app/components/concept/concept-link-reference-input.component';
import { SemanticTextInputComponent } from 'app/components/form/semantic-text-input.component';
import {
  SemanticTextInputLinkPopoverComponent, SemanticTextInputUnlinkConceptPopoverComponent,
  SemanticTextInputUnlinkExternalPopoverComponent
} from 'app/components/form/semantic-text-input-popover.component';
import {
  SelectConceptReferenceModalComponent,
  SelectConceptReferenceModalService
} from 'app/components/concept/select-concept-reference-modal.component';
import { FrontpageComponent } from 'app/components/frontpage.component';
import { RefreshComponent } from 'app/components/refresh.component';
import { LiteralListInputComponent } from 'app/components/form/literal-list-input.component';
import { TermsComponent } from 'app/components/form/terms.component';
import { TermComponent } from 'app/components/form/term.component';
import { LanguageInputComponent } from 'app/components/form/language-input.component';
import { FilterLanguageComponent } from 'app/components/form/filter-language.component';
import { ImportVocabularyModalComponent, ImportVocabularyModalService } from 'app/components/vocabulary/import-vocabulary-modal.component';
import {
  SearchOrganizationModalComponent,
  SearchOrganizationModalService
} from 'app/components/vocabulary/search-organization-modal.component';
import { PrefixInputComponent } from 'app/components/concept/prefix-input.component';
import { SearchGroupModalComponent, SearchGroupModalService } from 'app/components/vocabulary/search-group-modal.component';
import { AuthorizationManager } from 'app/services/authorization-manager.sevice';
import { UserDetailsComponent } from 'app/components/user-details.component';
import { OrganizationFilterDropdownComponent } from 'app/components/common/organization-filter-dropdown.component';
import { VocabularyFilterDropdownComponent } from 'app/components/common/vocabulary-filter-dropdown.component';
import { StatusFilterDropdownComponent } from 'app/components/common/status-filter-dropdown.component';
import { AUTHENTICATED_USER_ENDPOINT, LOCALIZER, YtiCommonModule } from 'yti-common-ui';
import { InformationAboutServiceComponent } from 'app/components/information/information-about-service.component';
import { ModalService } from './services/modal.service';
import { DragSortableDirective, DragSortableItemDirective } from './directives/drag-sortable.directive';
import { apiUrl } from './config';
import { LogoComponent } from './components/navigation/logo.component';
import { HttpClientModule } from '@angular/common/http';
import {
  RemoveLinkConfirmationModalComponent,
  RemoveLinkConfirmationModalService
} from './components/concept/remove-link-confirmation-modal.component';
import { ImportVocabularyCSVComponent } from './components/vocabulary/import-vocabulary-csv.component';
import { ImportVocabularyXMLComponent } from './components/vocabulary/import-vocabulary-xml.component';
import { ProgressComponent } from './components/progress.component';
import { ConfigurationService } from './services/configuration.service';
import { UrlInputModalComponent, UrlInputModalService } from './components/form/url-input-modal.component';
import { VocabularyMainComponent } from './components/vocabulary/vocabulary-main.component';

function removeEmptyValues(obj: {}) {

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!!value) {
      result[key] = value;
    }
  }

  return result;
}

const localizations: { [lang: string]: any } = {
  fi: {
    ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!../../po/fi.po`))),
    ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!yti-common-ui/po/fi.po`)))
  },
  en: {
    ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!../../po/en.po`))),
    ...removeEmptyValues(JSON.parse(require(`raw-loader!po-loader?format=mf!yti-common-ui/po/en.po`)))
  }
};

export function resolveAuthenticatedUserEndpoint() {
  return `${apiUrl}/authenticated-user`;
}

export function createTranslateLoader(): TranslateLoader {
  return { getTranslation: (lang: string) => of(localizations[lang]) };
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

export function refreshRouteMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (segments.length >= 1 && segments[0].path === 're') {
    return {
      consumed: segments
    };
  }
  return {
    consumed: []
  };
}

const appRoutes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'newVocabulary', component: NewVocabularyComponent },
  {
    path: 'concepts/:graphId', component: VocabularyMainComponent, canDeactivate: [ConfirmCancelEditGuard], children: [
      { path: '', component: NoSelectionComponent },
      { path: 'concept/:conceptId', component: ConceptComponent, canDeactivate: [ConfirmCancelEditGuard] },
      { path: 'collection/:collectionId', component: CollectionComponent, canDeactivate: [ConfirmCancelEditGuard] }
    ]
  },
  { path: 'userDetails', component: UserDetailsComponent },
  { path: 'information', component: InformationAboutServiceComponent },
  // NOTE: If createRefreshRouteMatcher(['re']) starts to work after angular upgrade, then switch to that.
  { matcher: refreshRouteMatcher, component: RefreshComponent }
];

export function initApp(configurationService: ConfigurationService) {
  return () => configurationService.fetchConfiguration();
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    FrontpageComponent,
    RefreshComponent,
    VocabulariesComponent,
    VocabularyMainComponent,
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
    SemanticTextInputUnlinkConceptPopoverComponent,
    SemanticTextInputUnlinkExternalPopoverComponent,
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    RemoveLinkConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    FloatDirective,
    TranslateSearchValuePipe,
    TimestampPipe,
    FilterLanguageComponent,
    ImportVocabularyModalComponent,
    ImportVocabularyCSVComponent,
    ImportVocabularyXMLComponent,
    PrefixInputComponent,
    UserDetailsComponent,
    OrganizationFilterDropdownComponent,
    VocabularyFilterDropdownComponent,
    StatusFilterDropdownComponent,
    InformationAboutServiceComponent,
    LogoComponent,
    DragSortableDirective,
    DragSortableItemDirective,
    ProgressComponent,
    UrlInputModalComponent
  ],
  entryComponents: [
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    RemoveLinkConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    ImportVocabularyModalComponent,
    UrlInputModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler },
    }),
    YtiCommonModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [ConfigurationService], multi: true },
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
    { provide: LOCALIZER, useExisting: LanguageService },
    TermedService,
    MetaModelService,
    LanguageService,
    LocationService,
    SearchConceptModalService,
    SearchOrganizationModalService,
    SearchGroupModalService,
    DeleteConfirmationModalService,
    RemoveLinkConfirmationModalService,
    SelectConceptReferenceModalService,
    SessionService,
    ElasticSearchService,
    ConfirmCancelEditGuard,
    AuthorizationManager,
    ImportVocabularyModalService,
    ModalService,
    Title,
    UrlInputModalService
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
