import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './components/app.component';
import { TermedService } from './services/termed.service';
import { NavigationBarComponent } from './components/navigation-bar.component';
import { TermedHttp } from './services/termed-http.service';
import { VocabulariesComponent } from './components/vocabularies.component';
import {
  TranslateModule, TranslateLoader, MissingTranslationHandler,
  MissingTranslationHandlerParams
} from 'ng2-translate';
import { Observable } from 'rxjs';
import { TranslateValuePipe } from './pipes/translate-value.pipe';
import { LanguageService } from './services/language.service';
import { ConceptsComponent } from './components/concepts.component';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { LocationService } from './services/location.service';
import { ConceptComponent } from './components/concept.component';
import { AjaxLoadingIndicatorComponent } from './components/ajax-loading-indicator.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { TranslateSearchValuePipe } from './pipes/translate-search-value.pipe';
import { LocalizedInputComponent } from './components/localized-input.component';
import { MetaModelService } from './services/meta-model.service';
import { PropertiesPipe } from './pipes/properties.pipe';
import { ReferencesPipe } from './pipes/references.pipe';
import { PropertyComponent } from './components/property.component';
import { ReferenceComponent } from './components/reference.component';
import { TermsComponent } from './components/terms.component';
import { NoSelectionComponent } from './components/no-selection.component';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { MarkdownLinksComponent } from './components/markdown/markdown-links.component';
import { MarkdownLinksElementComponent } from './components/markdown/markdown-links.component';
import { ConceptNetworkComponent } from './components/vis/concept-network.component';
import { VocabularyComponent } from './components/vocabulary.component';
import { AccordionChevronComponent } from './components/accordion-chevron.component';
import { LiteralInputComponent } from './components/literal-input.component';
import { MetaModelValidator } from './directives/validators/meta-model.validator';
import { KeysPipe } from './pipes/keys.pipe';
import { ErrorMessagesComponent } from './components/error-messages.component';
import { EditableButtonsComponent } from './components/editable-buttons.component';
import { LanguageValidator } from './directives/validators/language.validator';
import { LocalizationValidator } from './directives/validators/localization.validator';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { MarkdownElementComponent } from './components/markdown/markdown.component';
import { ConceptListComponent } from './components/concept-list.component';
import { ConceptHierarchyComponent } from './components/concept-hierarchy.component';
import { ConceptHierarchyNodeComponent } from './components/concept-hierarchy-node.component';
import { StatusInputComponent } from './components/status-input.component';
import { FooterComponent } from './components/footer.component';
import { MetaInformationComponent } from './components/meta-information.component';
import { FloatDirective } from './directives/float.directive';
import { ConceptReferenceInputComponent } from './components/concept-reference-input.component';
import { SearchConceptModal, SearchConceptModalService } from './components/search-concept.modal';
import { StripMarkdownPipe } from './pipes/strip-markdown.pipe';
import { ConceptFormComponent } from './components/concept-form.component';

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
  { path: '', component: VocabulariesComponent },
  { path: 'concepts/:graphId', component: ConceptsComponent, children: [
    { path: '', component: NoSelectionComponent },
    { path: 'concept/:conceptId', component: ConceptComponent }
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    BreadcrumbComponent,
    FooterComponent,
    VocabulariesComponent,
    VocabularyComponent,
    ConceptsComponent,
    ConceptListComponent,
    ConceptHierarchyComponent,
    ConceptHierarchyNodeComponent,
    ConceptComponent,
    ConceptFormComponent,
    NoSelectionComponent,
    PropertyComponent,
    ReferenceComponent,
    ConceptReferenceInputComponent,
    TermsComponent,
    AjaxLoadingIndicatorComponent,
    MarkdownComponent,
    MarkdownElementComponent,
    MarkdownLinksComponent,
    MarkdownLinksElementComponent,
    AccordionChevronComponent,
    LiteralInputComponent,
    StatusInputComponent,
    LocalizedInputComponent,
    ErrorMessagesComponent,
    EditableButtonsComponent,
    ConceptNetworkComponent,
    MetaInformationComponent,
    SearchConceptModal,
    MetaModelValidator,
    LanguageValidator,
    LocalizationValidator,
    FloatDirective,
    TranslateValuePipe,
    TranslateSearchValuePipe,
    HighlightPipe,
    PropertiesPipe,
    ReferencesPipe,
    TimestampPipe,
    StripMarkdownPipe,
    KeysPipe
  ],
  entryComponents: [
    SearchConceptModal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
    SearchConceptModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
