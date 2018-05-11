import {Component} from '@angular/core';
import { MetaModelService } from 'app/services/meta-model.service';
import { v4 as uuid } from 'uuid';
import { VocabularyNode } from 'app/entities/node';
import { EditableService } from 'app/services/editable.service';
import { Router } from '@angular/router';
import { TermedService } from 'app/services/termed.service';
import { GraphMeta } from 'app/entities/meta';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from 'app/services/language.service';
import { FormNode } from 'app/services/form-state';
import { defaultLanguages } from 'app/utils/language';
import { FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { firstMatching } from 'yti-common-ui/utils/array';
import { LocationService } from 'app/services/location.service';
import { Options } from 'yti-common-ui/components/dropdown.component';
import { vocabularyIdPrefix } from 'app/utils/id-prefix';

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
            <div class="col-6">
              <div class="form-group">
                <label for="vocabularyType" translate>Vocabulary type</label>
                <app-dropdown [formControl]="templateControl" id="vocabulary_type_dropdown" [options]="templateOptions"></app-dropdown>
              </div>
            </div>

            <div class="col-6">
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
  templateOptions: Options<GraphMeta>;
  formNode: FormNode;
  templateControl = new FormControl();
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

    this.templateControl.valueChanges.subscribe(() => this.createVocabulary());

    metaModelService.getMetaTemplates().subscribe(templates => {
      this.templateOptions = templates.map(template => ({
        value: template,
        name: () => this.languageService.translate(template.label, true)
      }));
      this.selectedTemplate = templates[0];
    });

    locationService.atNewVocabulary();
  }

  createVocabulary() {

    const label = this.translateService.instant('New vocabulary');
    const templateGraphId = this.selectedTemplate.graphId;
    const vocabularyId = uuid();

    this.metaModelService.getMeta(templateGraphId).subscribe(templateMetaModel => {

      this.vocabulary = templateMetaModel.createEmptyVocabulary(templateGraphId, vocabularyId);
      this.vocabulary.prefLabel = [ { lang: this.languageService.language, value: label } ];

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

  get selectedTemplate(): GraphMeta {
    return this.templateControl.value;
  }

  set selectedTemplate(value: GraphMeta) {
    this.templateControl.setValue(value);
  }

  saveVocabulary(): Promise<any> {

    const that = this;
    const vocabulary = this.vocabulary.clone();
    this.formNode.assignChanges(vocabulary);

    return new Promise((resolve, reject) => {
      this.termedService.createVocabulary(this.selectedTemplate.graphId, vocabulary, this.prefixFormControl.value)
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
        .map(inUse => inUse ? validationError : null);
    }
  }

  isPrefixLowerCaseValidator (control: AbstractControl) {
    const lowerCase = control.value === control.value.toLowerCase();
    return !lowerCase ? {'upperCaseInPrefix': {value: control.value}} : null;
  }
}
