import { Component } from '@angular/core';
import { MetaModelService } from '../../services/meta-model.service';
import { v4 as uuid } from 'uuid';
import { VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { Router } from '@angular/router';
import { TermedService } from '../../services/termed.service';
import { GraphMeta } from '../../entities/meta';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../../services/language.service';
import { FormNode } from '../../services/form-state';
import { defaultLanguages } from '../../utils/language';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-vocabulary',
  styleUrls: ['./new-vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div class="container-fluid">

      <app-ajax-loading-indicator *ngIf="!vocabulary"></app-ajax-loading-indicator>

      <div *ngIf="vocabulary">

        <form #form="ngForm" [formGroup]="formNode.control">

          <div class="row">
            <div class="col-6">
              <dl>
                <dt><label for="vocabularyType" translate>Vocabulary type</label></dt>
                <dd>
                  <select class="form-control"
                          id="vocabularyType"
                          [formControl]="templateControl">
                    <option *ngFor="let templateMeta of templates" [ngValue]="templateMeta">
                      {{templateMeta.label | translateValue:false}}
                    </option>
                  </select>
                </dd>
              </dl>
            </div>

            <div class="col-6">
              <app-editable-buttons [form]="form" [canRemove]="false"></app-editable-buttons>
            </div>
          </div>
          
          <app-vocabulary-form [vocabulary]="vocabulary" [form]="formNode"></app-vocabulary-form>
        </form>

      </div>

    </div>
  `
})
export class NewVocabularyComponent {

  vocabulary: VocabularyNode;
  templates: GraphMeta[];
  formNode: FormNode;
  templateControl = new FormControl();

  constructor(private router: Router,
              private metaModelService: MetaModelService,
              private termedService: TermedService,
              private translateService: TranslateService,
              private languageService: LanguageService,
              public editableService: EditableService) {

    editableService.edit();
    editableService.onSave = () => this.saveVocabulary();
    editableService.onCanceled = () => router.navigate(['/']);

    metaModelService.getMetaTemplates().subscribe(templates => {
      this.templates = templates;
      this.selectedTemplate = this.templates[0];
      this.createVocabulary();
    });

    this.templateControl.valueChanges.subscribe(() => this.createVocabulary());
  }

  createVocabulary() {
    this.translateService.get('New vocabulary').subscribe(label => {
      const graphId = uuid();
      const vocabularyId = uuid();

      this.metaModelService.copyTemplateToGraph(this.selectedTemplate, graphId).subscribe(newMeta => {
        this.vocabulary = newMeta.createEmptyVocabulary(graphId, vocabularyId);
        this.vocabulary.setPrimaryLabel(this.languageService.language, label);

        // TODO all meta models don't define language but they should
        if (this.vocabulary.meta.hasProperty('language')) {
          this.vocabulary.languages = defaultLanguages.slice();
        }

        this.formNode = new FormNode(this.vocabulary, () => defaultLanguages);
      });
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
      this.termedService.createVocabulary(this.selectedTemplate, vocabulary)
        .subscribe({
          next: () => that.router.navigate(['/concepts', that.vocabulary.graphId]),
          error: (err: any) => reject(err)
        });
    });
  }
}
