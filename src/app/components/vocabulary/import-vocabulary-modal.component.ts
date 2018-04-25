import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Localization } from 'yti-common-ui/types/localization';
import { flatten, anyMatching } from 'yti-common-ui/utils/array';
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
              public broader: Localization[],
              public related: Localization[],
              public isPartOf: Localization[],
              public status: Status,
              public lineNumber: number) {
  }

  static createFromCsvRow(csvJsonObject: any, lineNumber: number): CsvConceptDetails {

    function splitValuesAsOwnLocalizations(localization: Localization): Localization[] {
      return localization.value.split('\r\n').map(v => ({ lang: localization.lang, value: v}));
    }

    function parseLocalizationsForProperty(propertyName: string): Localization[] {

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

    function parseLiteralForProperty(propertyName: string): string {

      const entriesRelatedToProperty = Object.entries(csvJsonObject)
        .filter(([key, value]) => key === propertyName && value !== '');

      const literalProperty = entriesRelatedToProperty.map(([key, value]) => {
        return value;
      });

      return literalProperty[0] ? literalProperty[0] : 'DRAFT' as string;
    }

    return new CsvConceptDetails(
      parseLocalizationsForProperty('prefLabel'),
      parseLocalizationsForProperty('definition'),
      parseLocalizationsForProperty('note'),
      parseLocalizationsForProperty('example'),
      parseLocalizationsForProperty('synonym'),
      parseLocalizationsForProperty('broader'),
      parseLocalizationsForProperty('related'),
      parseLocalizationsForProperty('isPartOf'),
      parseLiteralForProperty('status') as Status,
      lineNumber
    );
  }

  get nonEmptyProperties(): ConceptProperty[] {

    const propertyIsNotEmpty = (localizations: Localization[]) => localizations.length > 0;

    const allProperties = [
      { name: 'prefLabel', localizations: this.prefLabel, type: '' },
      { name: 'definition', localizations: this.definition, type: 'property' },
      { name: 'note', localizations: this.note, type: 'property' },
      { name: 'example', localizations: this.example, type: 'property' },
      { name: 'synonym', localizations: this.synonym, type: 'property' },
      { name: 'broader', localizations: this.broader, type: 'reference' },
      { name: 'related', localizations: this.related, type: 'reference' },
      { name: 'isPartOf', localizations: this.isPartOf, type: 'reference' }
    ];

    return allProperties.filter(property => propertyIsNotEmpty(property.localizations));
  }

  get conceptStatus() {
    return this.status;
  }
}

interface CreatedConceptFromCsv {
  conceptNode: ConceptNode;
  broader: Localization[];
  related: Localization[];
  isPartOf: Localization[];
}

interface ConceptProperty {
  name: string;
  localizations: Localization[];
  type: string;
}

function localizationsHaveAnyMatch(localizations: Localization[], localizationsToCompare: Localization[]) {

  let result = false;

  for (const loc of localizations) {
    if (anyMatching(localizationsToCompare, locToComp => loc.value === locToComp.value && loc.lang === locToComp.lang)) {
      result = true;
    }
  }

  return result;
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
          <a><i class="fa fa-times" id="cancel_import_link" (click)="cancel()"></i></a>
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
                <div class="content">
                  <div *ngFor="let property of concept.nonEmptyProperties; let last = last"
                       [class.last]="last">
                    <div *ngIf="showNonEmptyProperty(property)">
                      <dl>
                        <dt><label class="name">{{property.name | translate}}</label></dt>
                        <dd>
                          <div class="localized" *ngFor="let localization of getPropertyLocalizations(property)">
                            <div class="language">{{localization.lang.toUpperCase()}}</div>
                            <div class="localization">{{localization.value}}</div>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <dl *ngIf="hasProperty('status')">
                    <dt><label class="name" translate>Concept status</label></dt>
                    <dd>{{concept.conceptStatus | translate}}</dd>
                  </dl>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="modal-footer">
        <button type="button" id="import_yes_button" class="btn btn-action confirm" (click)="confirm()" [disabled]="invalid" translate>Yes</button>
        <button type="button" id="import_cancel_button" class="btn btn-link cancel" (click)="cancel()" translate>Cancel</button>

        <div class="alert alert-danger modal-alert" id="import_error_modal" role="alert" *ngIf="importError">
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
  metaModel: MetaModel;
  importError = false;
  uploading = false;

  constructor(private modal: NgbActiveModal,
              private metaModelService: MetaModelService,
              private termedService: TermedService) {
  }

  ngOnInit(): void {

    this.uploading = true;

    this.metaModelService.getMeta(this.vocabulary.graphId)
      .subscribe(metaModel => {

        this.metaModel = metaModel;

        Papa.parse(this.importFile, {
          header: true,
          skipEmptyLines: true,
          newline: '\r\n',
          complete: results => {
            this.conceptsFromCsv = results.data.map((datum, index) => CsvConceptDetails.createFromCsvRow(datum, index + 2));
            this.uploading = false;
          }
        });
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

  get invalid() {
    return this.numberOfConceptsWithEmptyPrefLabels > 0;
  }

  hasProperty(name: string) {
    return this.metaModel.getNodeMeta(this.vocabulary.graphId, 'Concept').hasProperty(name);
  }

  hasReference(name: string) {
    return this.metaModel.getNodeMeta(this.vocabulary.graphId, 'Concept').hasReference(name);
  }

  showNonEmptyProperty(property: ConceptProperty) {
    return property.type === 'reference' ? this.hasReference(property.name) && this.getPropertyLocalizations(property).length > 0
                                         : true;
  }

  getPropertyLocalizations(property: ConceptProperty) {
    return property.type === 'reference' ? property.localizations.filter(localization => this.isReferenceConceptFound(localization)) : property.localizations;
  }

  isReferenceConceptFound(localization: Localization) {
    return this.conceptsFromCsv.filter(concept =>
      concept.prefLabel.filter(loc => loc.lang === localization.lang && loc.value === localization.value).length > 0).length > 0;
  }

  convertToConceptNode(conceptFromCsv: CsvConceptDetails): ConceptNode {

    const concept: ConceptNode = this.metaModel.createEmptyConcept(this.vocabulary);

    concept.prefLabel = conceptFromCsv.prefLabel;
    concept.definition = conceptFromCsv.definition;
    concept.note = conceptFromCsv.note;
    concept.example = conceptFromCsv.example;
    concept.altLabel = conceptFromCsv.synonym;

    if (concept.hasStatus()) {
      concept.status = conceptFromCsv.status;
    }

    return concept;
  }

  createConceptNodesToSave(conceptsToSave: CsvConceptDetails[]): ConceptNode[] {

    const createdConcepts = conceptsToSave.map(concept => {
      const newConceptNode = this.convertToConceptNode(concept);

      const createdConcept: CreatedConceptFromCsv = {
        conceptNode: newConceptNode,
        broader: concept.broader,
        related: concept.related,
        isPartOf: concept.isPartOf
      };

      return createdConcept;
    });

    return this.checkAndAddConceptReferences(createdConcepts);
  }

  checkAndAddConceptReferences(createdConcepts: CreatedConceptFromCsv[]): ConceptNode[] {

    return createdConcepts.map(createdConcept => {
      const conceptHasReferenceConcepts = createdConcept.broader.length > 0 || createdConcept.related.length > 0
                                                                            || createdConcept.isPartOf.length > 0;
      if (conceptHasReferenceConcepts) {
        for (const conceptToCompare of createdConcepts) {
          if (localizationsHaveAnyMatch(createdConcept.broader, conceptToCompare.conceptNode.prefLabel)
            && this.hasReference('broader')) {
            createdConcept.conceptNode.addBroaderConcept(conceptToCompare.conceptNode);
          }

          if (localizationsHaveAnyMatch(createdConcept.related, conceptToCompare.conceptNode.prefLabel)
            && this.hasReference('related')) {
            createdConcept.conceptNode.addRelatedConcept(conceptToCompare.conceptNode);
          }

          if (localizationsHaveAnyMatch(createdConcept.isPartOf, conceptToCompare.conceptNode.prefLabel)
            && this.hasReference('isPartOf')) {
            createdConcept.conceptNode.addIsPartOfConcept(conceptToCompare.conceptNode);
          }
        }
      }

      return createdConcept.conceptNode;
    });
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {

    this.uploading = true;

    const conceptsToSave = this.conceptsFromCsv;

    this.termedService.saveNodes(this.createConceptNodesToSave(conceptsToSave))
      .subscribe({
        next: () => this.modal.close(),
        error: () => {
          this.importError = true;
          this.uploading = false;
        }
      });
  }
}
