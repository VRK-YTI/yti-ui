import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './components/app.component';
import { TermedService } from './services/termed.service';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { TermedHttp } from './services/termed-http.service';
import { VocabulariesComponent } from './components/vocabulary/vocabularies.component';
import {
  TranslateModule, TranslateLoader, MissingTranslationHandler,
  MissingTranslationHandlerParams
} from 'ng2-translate';
import { Observable } from 'rxjs';
import { TranslateValuePipe } from './pipes/translate-value.pipe';
import { LanguageService } from './services/language.service';
import { ConceptsComponent } from './components/concept/concepts.component';
import { BreadcrumbComponent } from './components/navigation/breadcrumb.component';
import { LocationService } from './services/location.service';
import { ConceptComponent } from './components/concept/concept.component';
import { AjaxLoadingIndicatorComponent } from './components/common/ajax-loading-indicator.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { TranslateSearchValuePipe } from './pipes/translate-search-value.pipe';
import { LocalizedInputComponent } from './components/form/localized-input.component';
import { MetaModelService } from './services/meta-model.service';
import { PropertyComponent } from './components/form/property.component';
import { ReferenceComponent } from './components/form/reference.component';
import { NoSelectionComponent } from './components/concept/no-selection.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { MarkdownLinksComponent } from './components/markdown/markdown-links.component';
import { MarkdownLinksElementComponent } from './components/markdown/markdown-links.component';
import { ConceptNetworkComponent } from './components/visualization/concept-network.component';
import { VocabularyComponent } from './components/vocabulary/vocabulary.component';
import { AccordionChevronComponent } from './components/common/accordion-chevron.component';
import { LiteralInputComponent } from './components/form/literal-input.component';
import { MetaModelValidator } from './directives/validators/meta-model.validator';
import { KeysPipe } from './pipes/keys.pipe';
import { ErrorMessagesComponent } from './components/form/error-messages.component';
import { EditableButtonsComponent } from './components/form/editable-buttons.component';
import { ElasticSearchService } from "./services/elasticsearch.service";
import { LanguageValidator } from './directives/validators/language.validator';
import { LocalizationValidator } from './directives/validators/localization.validator';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { MarkdownElementComponent } from './components/markdown/markdown.component';
import { ConceptListComponent } from './components/concept/concept-list.component';
import { ConceptHierarchyComponent } from './components/concept/concept-hierarchy.component';
import { ConceptHierarchyNodeComponent } from './components/concept/concept-hierarchy-node.component';
import { StatusInputComponent } from './components/form/status-input.component';
import { FooterComponent } from './components/navigation/footer.component';
import { MetaInformationComponent } from './components/common/meta-information.component';
import { FloatDirective } from './directives/float.directive';
import { ConceptReferenceInputComponent } from './components/concept/concept-reference-input.component';
import { SearchConceptModal, SearchConceptModalService } from './components/concept/search-concept.modal';
import { StripMarkdownPipe } from './pipes/strip-markdown.pipe';
import { ConceptFormComponent } from './components/concept/concept-form.component';
import { DividerComponent } from './components/concept/divider.component';
import { SessionService } from './services/session.service';
import { DeleteConfirmationModal, DeleteConfirmationModalService } from './components/common/delete-confirmation.modal';
import { CollectionComponent } from './components/concept/collection.component';
import { CollectionListComponent } from './components/concept/collection-list.component';
import { ErrorModal, ErrorModalService } from './components/common/error.modal';
import { ConfirmationModal, ConfirmationModalService } from './components/common/confirmation.modal';
import { ConfirmCancelEditGuard } from './components/common/edit.guard';
import { UserService } from './services/user.service';
import { NewVocabularyComponent } from './components/concept/new-vocabulary.component';
import { VocabularyFormComponent } from './components/concept/vocabulary-form.component';
import { GroupInputComponent } from './components/vocabulary/group-input.component';
import { OrganizationInputComponent } from './components/vocabulary/organization-input.component';
import { AjaxLoadingIndicatorSmallComponent } from './components/common/ajax-loading-indicator-small.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConceptLinkReferenceInputComponent, ConceptLinkReferencePopover } from './components/concept/concept-link-reference-input.component';
import { MarkdownInputComponent } from './components/form/markdown-input.component';
import {
  MarkdownInputLinkPopoverComponent,
  MarkdownInputUnlinkPopoverComponent
} from './components/form/markdown-input-popover.component';
import {
  SelectConceptReferenceModal,
  SelectConceptReferenceModalService
} from './components/concept/select-concept-reference.modal';
import { FrontpageComponent } from './components/fronpage.component';
import { LiteralListInputComponent } from './components/form/literal-list-input.component';
import { RequiredListValidator } from './directives/validators/required-list.validator';
import { TermsComponent } from './components/form/terms.component';

const localizations: { [lang: string]: string} = {
  fi: require('json-loader!po-loader?format=mf!../../po/fi.po'),
  en: require('json-loader!po-loader?format=mf!../../po/en.po')
};

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
  ]}
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
    ConceptLinkReferencePopover,
    TermsComponent,
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
    SearchConceptModal,
    DeleteConfirmationModal,
    ErrorModal,
    ConfirmationModal,
    SelectConceptReferenceModal,
    MetaModelValidator,
    LanguageValidator,
    LocalizationValidator,
    RequiredListValidator,
    FloatDirective,
    TranslateValuePipe,
    TranslateSearchValuePipe,
    HighlightPipe,
    TimestampPipe,
    StripMarkdownPipe,
    KeysPipe
  ],
  entryComponents: [
    SearchConceptModal,
    DeleteConfirmationModal,
    ErrorModal,
    ConfirmationModal,
    SelectConceptReferenceModal,
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
    TermedHttp,
    TermedService,
    MetaModelService,
    { provide: MissingTranslationHandler, useFactory: createMissingTranslationHandler },
    LanguageService,
    LocationService,
    SearchConceptModalService,
    DeleteConfirmationModalService,
    ErrorModalService,
    ConfirmationModalService,
    SelectConceptReferenceModalService,
    SessionService,
    ElasticSearchService,
    ConfirmCancelEditGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
