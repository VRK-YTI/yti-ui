import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './components/app.component';
import { TermedService } from './services/termed.service';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { TermedHttp } from './services/termed-http.service';
import { VocabulariesComponent } from './components/vocabulary/vocabularies.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from 'ng2-translate';
import { Observable } from 'rxjs';
import { TranslateValuePipe } from './pipes/translate-value.pipe';
import { LanguageService } from './services/language.service';
import { ConceptsComponent } from './components/concept/concepts.component';
import { BreadcrumbComponent } from 'yti-common-ui/components/breadcrumb.component';
import { LocationService } from './services/location.service';
import { ConceptComponent } from './components/concept/concept.component';
import { TranslateSearchValuePipe } from './pipes/translate-search-value.pipe';
import { LocalizedInputComponent } from './components/form/localized-input.component';
import { MetaModelService } from './services/meta-model.service';
import { PropertyComponent } from './components/form/property.component';
import { ReferenceComponent } from './components/form/reference.component';
import { NoSelectionComponent } from './components/common/no-selection.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { MarkdownLinksComponent, MarkdownLinksElementComponent } from './components/markdown/markdown-links.component';
import { ConceptNetworkComponent } from './components/visualization/concept-network.component';
import { VocabularyComponent } from './components/vocabulary/vocabulary.component';
import { LiteralInputComponent } from './components/form/literal-input.component';
import { MetaModelValidatorDirective } from './directives/validators/meta-model.validator';
import { ErrorMessagesComponent } from './components/form/error-messages.component';
import { EditableButtonsComponent } from './components/form/editable-buttons.component';
import { ElasticSearchService } from './services/elasticsearch.service';
import { MarkdownComponent, MarkdownElementComponent } from './components/markdown/markdown.component';
import { ConceptListComponent } from './components/concept/concept-list.component';
import { ConceptHierarchyComponent } from './components/concept/concept-hierarchy.component';
import { ConceptHierarchyNodeComponent } from './components/concept/concept-hierarchy-node.component';
import { StatusInputComponent } from './components/form/status-input.component';
import { FooterComponent } from 'yti-common-ui/components/footer.component';
import { MetaInformationComponent } from './components/common/meta-information.component';
import { FloatDirective } from './directives/float.directive';
import { ConceptReferenceInputComponent } from './components/concept/concept-reference-input.component';
import { SearchConceptModalComponent, SearchConceptModalService } from './components/concept/search-concept-modal.component';
import { StripMarkdownPipe } from './pipes/strip-markdown.pipe';
import { ConceptFormComponent } from './components/concept/concept-form.component';
import { DividerComponent } from './components/common/divider.component';
import { SessionService } from './services/session.service';
import { DeleteConfirmationModalComponent, DeleteConfirmationModalService } from './components/common/delete-confirmation-modal.component';
import { CollectionComponent } from './components/collection/collection.component';
import { CollectionListComponent } from './components/collection/collection-list.component';
import { ConfirmCancelEditGuard } from './components/common/edit.guard';
import { NewVocabularyComponent } from './components/vocabulary/new-vocabulary.component';
import { VocabularyFormComponent } from './components/vocabulary/vocabulary-form.component';
import { GroupInputComponent } from './components/vocabulary/group-input.component';
import { OrganizationInputComponent } from './components/vocabulary/organization-input.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConceptLinkReferenceInputComponent, ConceptLinkReferencePopoverComponent } from './components/concept/concept-link-reference-input.component';
import { MarkdownInputComponent } from './components/form/markdown-input.component';
import { MarkdownInputLinkPopoverComponent, MarkdownInputUnlinkPopoverComponent } from './components/form/markdown-input-popover.component';
import { SelectConceptReferenceModalComponent, SelectConceptReferenceModalService } from './components/concept/select-concept-reference-modal.component';
import { FrontpageComponent } from './components/frontpage.component';
import { LiteralListInputComponent } from './components/form/literal-list-input.component';
import { RequiredListValidatorDirective } from './directives/validators/required-list.validator';
import { TermsComponent } from './components/form/terms.component';
import { TermComponent } from './components/form/term.component';
import { LanguageInputComponent } from './components/form/language-input.component';
import { LanguageValidatorDirective } from './directives/validators/language.validator';
import { FilterLanguageComponent } from './components/form/filter-language.component';
import { ImportVocabularyModalComponent, ImportVocabularyModalService } from './components/vocabulary/import-vocabulary-modal.component';
import { SearchOrganizationModalComponent, SearchOrganizationModalService } from './components/vocabulary/search-organization-modal.component';
import { PrefixInputComponent } from './components/concept/prefix-input.component';
import { SearchGroupModalComponent, SearchGroupModalService } from './components/vocabulary/search-group-modal.component';
import { AuthorizationManager } from './services/authorization-manager.sevice';
import { UserDetailsComponent } from './components/user-details.component';
import { StatusComponent } from './components/common/status.component';
import { OrganizationFilterDropdownComponent } from './components/common/organization-filter-dropdown.component';
import { VocabularyFilterDropdownComponent } from './components/common/vocabulary-filter-dropdown.component';
import { StatusFilterDropdownComponent } from './components/common/status-filter-dropdown.component';
import { AjaxLoadingIndicatorComponent } from 'yti-common-ui/components/ajax-loading-indicator.component';
import { AjaxLoadingIndicatorSmallComponent } from 'yti-common-ui/components/ajax-loading-indicator-small.component';
import { AccordionChevronComponent } from 'yti-common-ui/components/accordion-chevron.component';
import { ErrorModalComponent, ErrorModalService } from 'yti-common-ui/components/error-modal.component';
import { ConfirmationModalComponent, ConfirmationModalService } from 'yti-common-ui/components/confirmation-modal.component';
import { LoginModalComponent, LoginModalService } from 'yti-common-ui/components/login-modal.component';
import { HighlightPipe } from 'yti-common-ui/pipes/highlight.pipe';
import { KeysPipe } from 'yti-common-ui/pipes/keys.pipe';
import { MenuComponent } from 'yti-common-ui/components/menu.component';
import { DropdownComponent } from 'yti-common-ui/components/dropdown.component';
import { FilterDropdownComponent } from 'yti-common-ui/components/filter-dropdown.component';
import { PopoverCloseComponent } from 'yti-common-ui/components/popover-close.component';
import { UserService } from 'yti-common-ui/services/user.service';
import { AUTHENTICATED_USER_ENDPOINT } from 'yti-common-ui';
import { environment } from '../environments/environment';

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
  return `${environment.api_url}/authenticated-user`;
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
  { path: 'userDetails', component: UserDetailsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    BreadcrumbComponent,
    FooterComponent,
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
    AjaxLoadingIndicatorComponent,
    AjaxLoadingIndicatorSmallComponent,
    MarkdownComponent,
    MarkdownElementComponent,
    MarkdownLinksComponent,
    MarkdownLinksElementComponent,
    AccordionChevronComponent,
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
    MarkdownInputComponent,
    MarkdownInputLinkPopoverComponent,
    MarkdownInputUnlinkPopoverComponent,
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    ErrorModalComponent,
    ConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    LoginModalComponent,
    MetaModelValidatorDirective,
    RequiredListValidatorDirective,
    LanguageValidatorDirective,
    FloatDirective,
    TranslateValuePipe,
    TranslateSearchValuePipe,
    HighlightPipe,
    TimestampPipe,
    StripMarkdownPipe,
    KeysPipe,
    FilterLanguageComponent,
    ImportVocabularyModalComponent,
    PrefixInputComponent,
    UserDetailsComponent,
    MenuComponent,
    StatusComponent,
    DropdownComponent,
    FilterDropdownComponent,
    OrganizationFilterDropdownComponent,
    VocabularyFilterDropdownComponent,
    StatusFilterDropdownComponent,
    PopoverCloseComponent
  ],
  entryComponents: [
    SearchConceptModalComponent,
    SearchOrganizationModalComponent,
    SearchGroupModalComponent,
    DeleteConfirmationModalComponent,
    ErrorModalComponent,
    ConfirmationModalComponent,
    SelectConceptReferenceModalComponent,
    LoginModalComponent,
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
    TranslateModule.forRoot({ provide: TranslateLoader, useFactory: createTranslateLoader })
  ],
  providers: [
    { provide: AUTHENTICATED_USER_ENDPOINT, useFactory: resolveAuthenticatedUserEndpoint },
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
    ErrorModalService,
    ConfirmationModalService,
    SelectConceptReferenceModalService,
    LoginModalService,
    SessionService,
    ElasticSearchService,
    ConfirmCancelEditGuard,
    UserService,
    AuthorizationManager,
    ImportVocabularyModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
