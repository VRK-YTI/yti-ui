import { Component } from '@angular/core';
import { MetaModelService } from '../../services/meta-model.service';
import { v4 as uuid } from 'uuid';
import { VocabularyNode } from '../../entities/node';
import { EditableService } from '../../services/editable.service';
import { Router } from '@angular/router';
import { TermedService } from '../../services/termed.service';
import { GraphMeta, MetaModel } from '../../entities/meta';
import { TranslateService } from 'ng2-translate';
import { LanguageService } from '../../services/language.service';
import { FormNode } from '../../services/form-state';
import { defaultLanguages } from '../../utils/language';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'new-vocabulary',
  styleUrls: ['./new-vocabulary.component.scss'],
  providers: [EditableService],
  template: `
    <div class="container-fluid">

      <ajax-loading-indicator *ngIf="!vocabulary"></ajax-loading-indicator>

      <div *ngIf="vocabulary">

        <form [formGroup]="form.control" name="newVocabularyForm">

          <div class="row">
            <div class="col-6">
              <dl>
                <dt><label for="vocabularyType" translate>Vocabulary type</label></dt>
                <dd>
                  <select class="form-control"
                          id="vocabularyType"
                          [formControl]="templateControl"
                          *ngIf="selectedTemplate">
                    <option *ngFor="let templateMeta of templates" [ngValue]="templateMeta">
                      {{templateMeta.label | translateValue}}
                    </option>
                  </select>
                </dd>
              </dl>
            </div>

            <div class="col-6">
              <editable-buttons [form]="form" [canRemove]="false"></editable-buttons>
            </div>
          </div>
          
          <vocabulary-form [vocabulary]="vocabulary" [form]="form"></vocabulary-form>
        </form>

      </div>

    </div>
  `
})
export class NewVocabularyComponent {

  vocabulary: VocabularyNode;
  templates: GraphMeta[];
  meta: MetaModel;
  form: FormNode;
  templateControl = new FormControl();

  constructor(private router: Router,
              metaModelService: MetaModelService,
              private termedService: TermedService,
              private translateService: TranslateService,
              private languageService: LanguageService,
              public editableService: EditableService) {

    editableService.edit();
    editableService.onSave = () => this.saveVocabulary();
    editableService.onCanceled = () => router.navigate(['/']);

    metaModelService.getMeta().subscribe(meta => {
      this.meta = meta;
      this.templates = meta.getMetaTemplates();
      this.selectedTemplate = this.templates[0];
    });

    this.templateControl.valueChanges.subscribe(() => this.createVocabulary());
  }

  createVocabulary() {
    this.translateService.get('New vocabulary').subscribe(label => {
      const graphId = uuid();
      const vocabularyId = uuid();
      const newMeta = this.meta.copyTemplateToGraph(this.selectedTemplate, graphId);
      this.vocabulary = newMeta.createEmptyVocabulary(graphId, vocabularyId, label, this.languageService.language);
      this.form = new FormNode(this.vocabulary, defaultLanguages);
    });
  }

  get selectedTemplate(): GraphMeta {
    return this.templateControl.value;
  }

  set selectedTemplate(value: GraphMeta) {
    this.templateControl.setValue(value);
    this.createVocabulary();
  }

  saveVocabulary(): Promise<any> {

    const that = this;

    return new Promise((resolve, reject) => {
      this.termedService.createVocabulary(this.selectedTemplate, this.vocabulary)
        .subscribe({
          next: () => that.router.navigate(['/concepts', that.vocabulary.graphId]),
          error: (err: any) => reject(err)
        });
    });
  }
}
