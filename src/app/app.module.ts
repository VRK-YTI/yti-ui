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
import { MarkdownComponent } from './components/markdown/markdown.component';
import { MarkdownElementComponent } from './components/markdown/markdown-element.component';
import { VocabularyComponent } from './components/vocabulary.component';
import { AccordionChevronComponent } from './components/accordion-chevron.component';
import { LiteralInputComponent } from './components/literal-input.component';
import { MetaModelValidator } from './components/validators/meta-model.validator';
import { KeysPipe } from './pipes/keys.pipe';
import { ErrorMessagesComponent } from './components/error-messages.component';
import { EditableFormDirective } from './components/directives/editable-form.directive';
import { EditableButtonsComponent } from './components/editable-buttons.component';
import { StripMarkdownPipe } from './pipes/strip-markdown.pipe';
import { LanguageValidator } from './components/validators/language.validator';
import { LocalizationValidator } from './components/validators/localization.validator';

const localizations: { [lang: string]: string} = {
  fi: require('json!po?format=mf!../../po/fi.po'),
  en: require('json!po?format=mf!../../po/en.po')
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
    VocabulariesComponent,
    VocabularyComponent,
    ConceptsComponent,
    ConceptComponent,
    NoSelectionComponent,
    PropertyComponent,
    ReferenceComponent,
    TermsComponent,
    AjaxLoadingIndicatorComponent,
    LocalizedInputComponent,
    MarkdownComponent,
    MarkdownElementComponent,
    AccordionChevronComponent,
    LiteralInputComponent,
    ErrorMessagesComponent,
    EditableButtonsComponent,
    EditableFormDirective,
    MetaModelValidator,
    LanguageValidator,
    LocalizationValidator,
    TranslateValuePipe,
    TranslateSearchValuePipe,
    HighlightPipe,
    PropertiesPipe,
    ReferencesPipe,
    TimestampPipe,
    StripMarkdownPipe,
    KeysPipe
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
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
