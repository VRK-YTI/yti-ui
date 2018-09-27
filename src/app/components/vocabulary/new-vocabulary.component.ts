import { Component } from '@angular/core';
import { MetaModelService } from 'app/services/meta-model.service';
import { v4 as uuid } from 'uuid';
import { VocabularyNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { Router } from '@angular/router';
import { TermedService } from 'app/services/termed.service';
import { GraphMeta } from 'app/entities/meta';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'app/services/language.service';
import { FormNode } from 'app/services/form-state';
import { defaultLanguages } from 'app/utils/language';
import { AbstractControl, AsyncValidatorFn, FormControl, Validators } from '@angular/forms';
import { firstMatching } from 'yti-common-ui/utils/array';
import { LocationService } from 'app/services/location.service';
import { vocabularyIdPrefix } from 'app/utils/id-prefix';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-vocabulary',
  styleUrls: ['./new-vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div class="content-box">
      <app-ajax-loading-indicator *ngIf="!vocabulary"></app-ajax-loading-indicator>

      <div *ngIf="vocabulary">

        <form #form="ngForm" [formGroup]="formNode.control">

          <div class="row">
            <div class="col-12">
              <div class="top-actions">
                <app-editable-buttons [form]="form"
                                      [canRemove]="false"
                                      [idPrefix]="idPrefix"></app-editable-buttons>
              </div>
            </div>
          </div>

          <app-vocabulary-form [vocabulary]="vocabulary" [form]="formNode"></app-vocabulary-form>
          <app-prefix-input [formControl]="prefixFormControl" [idPrefix]="idPrefix"></app-prefix-input>
        </form>

      </div>
    </div>
  `
})
export class NewVocabularyComponent {

  vocabulary: VocabularyNode;
  selectedTemplate?: GraphMeta;
  formNode: FormNode;
  prefixFormControl: FormControl;
  idPrefix: string = vocabularyIdPrefix;

  constructor(private router: Router,
              private metaModelService: MetaModelService,
              private termedService: TermedService,
              private translateService: TranslateService,
              private languageService: LanguageService,
              public editableService: EditableService,
              locationService: LocationService) {

    editableService.edit();
    editableService.onSave = () => this.saveVocabulary();
    editableService.onCanceled = () => router.navigate(['/']);

    metaModelService.getMetaTemplates().subscribe(templates => {
      const template = templates.find(template => template.has('TerminologicalVocabulary')) || templates[0];
      this.selectedTemplate = template
      this.createVocabulary(template);
    });

    locationService.atNewVocabulary();
  }

  createVocabulary(template: GraphMeta) {

    const label = this.translateService.instant('New vocabulary');
    const templateGraphId = template.graphId;
    const vocabularyId = uuid();

    this.metaModelService.getMeta(templateGraphId).subscribe(templateMetaModel => {

      this.vocabulary = templateMetaModel.createEmptyVocabulary(templateGraphId, vocabularyId);
      this.vocabulary.prefLabel = [{ lang: this.languageService.language, value: label }];

      // TODO all meta models don't define language but they should
      if (this.vocabulary.hasLanguage()) {
        this.vocabulary.languages = defaultLanguages.slice();
      }

      const languageProvider = () => {
        const languageProperty = firstMatching(this.formNode.properties, property => property.name === 'language');
        return languageProperty ? languageProperty.value.value.filter((v: string) => !!v) : defaultLanguages;
      };

      this.formNode = new FormNode(this.vocabulary, languageProvider, templateMetaModel);

      this.prefixFormControl = new FormControl('', [Validators.required, this.isPrefixLowerCaseValidator], this.isPrefixInUseValidator());
      this.formNode.control.addControl('prefix', this.prefixFormControl);
    });
  }

  saveVocabulary(): Promise<any> {

    const that = this;
    const vocabulary = this.vocabulary.clone();
    const templateGraphId = this.selectedTemplate && this.selectedTemplate.graphId || this.vocabulary.meta.graphId;
    this.formNode.assignChanges(vocabulary);

    return new Promise((resolve, reject) => {
      this.termedService.createVocabulary(templateGraphId, vocabulary, this.prefixFormControl.value)
        .subscribe({
          next: (graphId) => that.router.navigate(['/concepts', graphId]),
          error: (err: any) => reject(err)
        });
    });
  }

  isPrefixInUseValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const validationError = {
        prefixInUse: {
          valid: false
        }
      };
      return this.termedService.isNamespaceInUse(control.value)
        .pipe(map(inUse => inUse ? validationError : null));
    }
  }

  isPrefixLowerCaseValidator(control: AbstractControl) {
    const lowerCase = control.value === control.value.toLowerCase();
    return !lowerCase ? { 'upperCaseInPrefix': { value: control.value } } : null;
  }
}
