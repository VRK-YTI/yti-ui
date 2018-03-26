import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Localization } from 'yti-common-ui/types/localization';
import { flatten } from 'yti-common-ui/utils/array';
import { ConceptNode, VocabularyNode } from 'app/entities/node';
import { MetaModelService } from 'app/services/meta-model.service';
import { MetaModel } from 'app/entities/meta';
import { TermedService } from 'app/services/termed.service';
import * as Papa from 'papaparse';
import { ModalService } from 'app/services/modal.service';
import { Status } from 'yti-common-ui/entities/status';

class CsvConceptDetails {

  constructor(public prefLabel: Localization[],
              public definition: Localization[],
              public note: Localization[],
              public example: Localization[],
              public synonym: Localization[],
              public status: Status,
              public lineNumber: number) {
  }

  static createFromCsvRow(csvJsonObject: any, lineNumber: number): CsvConceptDetails {

    function splitValuesAsOwnLocalizations(localization: Localization) {
      return localization.value.split('\r\n').map(v => ({ lang: localization.lang, value: v}));
    }

    function parseLocalizationsForProperty(propertyName: string) {

      const entriesRelatedToProperty = Object.entries(csvJsonObject)
        .filter(([key, value]) => key.startsWith(propertyName) && value !== '');

      const localizations = entriesRelatedToProperty.map(([key, value]) => {
        return {
          lang: key.replace(propertyName + '_', ''),
          value: value
        };
      });

      return flatten(localizations.map(localization => splitValuesAsOwnLocalizations(localization)));
    }

    function parseLiteralForProperty(propertyName: string) {

      const entriesRelatedToProperty = Object.entries(csvJsonObject)
        .filter(([key, value]) => key === propertyName && value !== '');

      const literalProperty = entriesRelatedToProperty.map(([key, value]) => {
        return value;
      });

      return literalProperty[0] as string;
    }

    return new CsvConceptDetails(
      parseLocalizationsForProperty('prefLabel'),
      parseLocalizationsForProperty('definition'),
      parseLocalizationsForProperty('note'),
      parseLocalizationsForProperty('example'),
      parseLocalizationsForProperty('synonym'),
      parseLiteralForProperty('status') as Status,
      lineNumber
    );
  }

  get nonEmptyProperties(): {name: string, localizations: Localization[]}[] {

    const propertyIsNotEmpty = (localizations: Localization[]) => localizations.length > 0;

    const allProperties = [
      { name: 'prefLabel', localizations: this.prefLabel },
      { name: 'definition', localizations: this.definition },
      { name: 'note', localizations: this.note },
      { name: 'example', localizations: this.example },
      { name: 'synonym', localizations: this.synonym }
    ];

    return allProperties.filter(property => propertyIsNotEmpty(property.localizations));
  }
}

@Injectable()
export class ImportVocabularyModalService {

  constructor(private modalService: ModalService) {
  }

  open(importFile: File, vocabulary: VocabularyNode): Promise<any> {
    const modalRef = this.modalService.open(ImportVocabularyModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as ImportVocabularyModalComponent;
    instance.importFile = importFile;
    instance.vocabulary = vocabulary;
    return modalRef.result;
  }
}

@Component({
  selector: 'app-import-vocabulary-modal',
  styleUrls: ['./import-vocabulary-modal.component.scss'],
  template: `
    <div *ngIf="uploading">
      <app-ajax-loading-indicator></app-ajax-loading-indicator>
    </div>

    <div *ngIf="!uploading">    
      <div class="modal-header">
        <h4 class="modal-title">
          <a><i class="fa fa-times" (click)="cancel()"></i></a>
          <span translate>Confirm import</span>
        </h4>
      </div>
      <div class="modal-body full-height">
        <div class="row mb-2">
          <div class="col-md-12">

            <h6>
              <span translate>Importing</span> {{numberOfConcepts}} <span translate>concepts</span>
            </h6>

            <div *ngIf="invalid" class="alert alert-danger">
              <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
              <span translate>Import is not allowed because some of the concepts lack preferred term.</span>
              <span translate>Line numbers in the import file</span>: {{lineNumbersOfEmptyPrefLabels}}
            </div>
            
            <div class="search-results">
              <div class="search-result" *ngFor="let concept of conceptsFromCsv">
                <div *ngFor="let property of concept.nonEmptyProperties; let last = last"
                    class="content"
                    [class.last]="last"
                    [ngSwitch]="property.name">
                  <span class="name">{{property.name | translate}}</span>
                  <div class="body">
                    <div class="localized" *ngFor="let localization of property.localizations">
                      <div class="language">{{localization.lang.toUpperCase()}}</div>
                      <div class="localization">{{localization.value}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-action confirm" (click)="confirm()" [disabled]="invalid" translate>Yes</button>
        <button type="button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>
        
        <div class="alert alert-danger modal-alert" role="alert" *ngIf="importError">
          <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
          <span translate>Import failed</span>
        </div>
      </div>
    </div>
  `
})
export class ImportVocabularyModalComponent implements OnInit {

  @Input() importFile: File;
  @Input() vocabulary: VocabularyNode;

  conceptsFromCsv: CsvConceptDetails[] = [];
  importError = false;
  uploading = false;

  constructor(private modal: NgbActiveModal,
              private metaModelService: MetaModelService,
              private termedService: TermedService) {
  }

  ngOnInit(): void {
    this.uploading = true;

    Papa.parse(this.importFile, {
      header: true,
      skipEmptyLines: true,
      newline: '\r\n',
      complete: results => {
        this.conceptsFromCsv = results.data.map((datum, index) => CsvConceptDetails.createFromCsvRow(datum, index + 2));
        this.uploading = false;
      }
    });
  }

  get numberOfConcepts() {
    return this.conceptsFromCsv ? this.conceptsFromCsv.length : 0;
  }

  get conceptsWithEmptyPrefLabels() {
    return this.conceptsFromCsv.filter(concept => concept.prefLabel.length === 0);
  }

  get numberOfConceptsWithEmptyPrefLabels() {
    return this.conceptsWithEmptyPrefLabels.length;
  }

  get lineNumbersOfEmptyPrefLabels() {
    return this.conceptsWithEmptyPrefLabels.map(concept => concept.lineNumber).join(', ');
  }

  convertToConceptNode(conceptFromCsv: CsvConceptDetails, metaModel: MetaModel): ConceptNode {

    const concept: ConceptNode = metaModel.createEmptyConcept(this.vocabulary);

    concept.prefLabel = conceptFromCsv.prefLabel;
    concept.definition = conceptFromCsv.definition;
    concept.note = conceptFromCsv.note;
    concept.example = conceptFromCsv.example;
    concept.altLabel = conceptFromCsv.synonym;
    concept.status = conceptFromCsv.status;

    return concept;
  }

  get invalid() {
    return this.numberOfConceptsWithEmptyPrefLabels > 0;
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    
    this.uploading = true;

    const conceptsToSave = this.conceptsFromCsv;

    this.metaModelService.getMeta(this.vocabulary.graphId).subscribe(metaModel =>
      this.termedService.saveNodes(conceptsToSave.map(concept => this.convertToConceptNode(concept, metaModel)))
        .subscribe({
          next: () => this.modal.close(),
          error: () => {
            this.importError = true;
            this.uploading = false;
          }
        })
    );
  }
}
