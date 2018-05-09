import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Localization } from 'yti-common-ui/types/localization';
import { containsAny, firstMatching, flatten, contains, allMatching } from 'yti-common-ui/utils/array';
import { ConceptNode, VocabularyNode } from 'app/entities/node';
import { MetaModelService } from 'app/services/meta-model.service';
import { MetaModel, NodeMeta } from 'app/entities/meta';
import { TermedService } from 'app/services/termed.service';
import * as Papa from 'papaparse';
import { ModalService } from 'app/services/modal.service';
import { v4 as uuid } from 'uuid';
import { assertNever, requireDefined } from 'yti-common-ui/utils/object';
import { allStatuses } from 'yti-common-ui/entities/status';

type ColumnType = 'localized'
                | 'literal';

interface ValidationError {
  translationKey: string;
  params?: {};
}

class ColumnDetails {

  columns: { [name: string]: ColumnType } = {};
  validationErrors: ValidationError[] = [];
}

class CsvConceptDetails {

  id = uuid();
  columns: { [name: string]: Localization[]|string } = {};

  constructor(csvJsonObject: any, columnDetails: ColumnDetails, public lineNumber: number) {

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

    function parseLiteral(propertyName: string): string {
      return csvJsonObject[propertyName];
    }

    for (const [propertyName, columnType] of Object.entries(columnDetails.columns)) {
      switch (columnType) {
        case 'localized':
          this.columns[propertyName] = parseLocalizationsForProperty(propertyName);
          break;
        case 'literal':
          this.columns[propertyName] = parseLiteral(propertyName);
          break;
        default:
          assertNever(columnType);
      }
    }
  }
}

function isLiteral(columnValue: Localization[]|string): columnValue is string {
  return typeof columnValue === 'string';
}

function localizationsAreEqual(lhs: Localization, rhs: Localization): boolean {
  return lhs.value === rhs.value && lhs.lang === rhs.lang;
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

            <div *ngIf="invalid">
              <ul class="errors">
                <li *ngFor="let error of validationErrors">
                  <span translate [translateParams]="error.params">{{error.translationKey}}</span>      
                </li>
              </ul>
            </div>
            
            <div class="search-results">
              <div class="search-result" *ngFor="let concept of concepts">
                <div class="content">

                  <!-- special handling for labels -->
                  <dl>
                    <dt><label class="name" translate>prefLabel</label></dt>
                    <dd>
                      <div class="localized" *ngFor="let localization of concept.prefLabel">
                        <div class="language">{{localization.lang.toUpperCase()}}</div>
                        <div class="localization">{{localization.value}}</div>
                      </div>
                    </dd>
                  </dl>
                  
                  <dl *ngIf="concept.altLabel.length > 0">
                    <dt><label class="name" translate>synonym</label></dt>
                    <dd>
                      <div class="localized" *ngFor="let localization of concept.altLabel">
                        <div class="language">{{localization.lang.toUpperCase()}}</div>
                        <div class="localization">{{localization.value}}</div>
                      </div>
                    </dd>
                  </dl>
                  
                  <div *ngFor="let property of concept.getAllProperties(); let last = last"
                       [class.last]="last">
                    <div *ngIf="!property.isEmpty() && !property.isLabel()">
                      <dl>
                        <dt><label class="name">{{property.meta.label | translateValue}}</label></dt>
                        
                        <dd *ngIf="property.isLocalizable()">
                          <div class="localized" *ngFor="let localization of property.asLocalizations()">
                            <div class="language">{{localization.lang.toUpperCase()}}</div>
                            <div class="localization">{{localization.value}}</div>
                          </div>
                        </dd>
                        
                        <dd *ngIf="!property.isLocalizable()">
                          <span *ngIf="!property.isStatus()">{{property.literalValue}}</span>
                          <span *ngIf="property.isStatus()">{{property.literalValue | translate}}</span>
                        </dd>
                        
                      </dl>
                    </div>
                  </div>

                  <div *ngFor="let reference of concept.getConceptReferences()">
                    <div *ngFor="let value of reference.values">
                      <dl>
                        <dt><label class="name">{{reference.meta.label | translateValue}}</label></dt>
                        <dd>
                          <div class="localized" *ngFor="let localization of value.prefLabel">
                            <div class="language">{{localization.lang.toUpperCase()}}</div>
                            <div class="localization">{{localization.value}}</div>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  
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

  concepts: ConceptNode[] = [];
  validationErrors: ValidationError[] = [];

  metaModel: MetaModel;
  conceptMeta: NodeMeta;
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
        this.conceptMeta = metaModel.getNodeMeta(this.vocabulary.graphId, 'Concept');

        Papa.parse(this.importFile, {
          header: true,
          skipEmptyLines: true,
          newline: '\r\n',
          complete: results => {

            const columnDetails = ImportVocabularyModalComponent.parseColumnDetails(results.meta.fields);
            columnDetails.validationErrors.forEach(error => this.validationErrors.push(error));

            if (this.validationErrors.length === 0) {
              const conceptsFromCsv = results.data.map((datum, index) => new CsvConceptDetails(datum, columnDetails, index + 2));
              this.concepts = this.convertToConceptNodes(conceptsFromCsv);
            }

            this.uploading = false;
          }
        });
      });
  }

  private static parseColumnDetails(columnNames: string[]): ColumnDetails {

    const result = new ColumnDetails();

    for (const columnName of columnNames) {

      // TODO validation, for example for multiple underscores
      const underscorePosition = columnName.indexOf('_');
      const isLocalized = underscorePosition !== -1;
      const propertyName = isLocalized ? columnName.substr(0, underscorePosition) : columnName;

      result.columns[propertyName] = isLocalized ? 'localized' : 'literal';
    }

    return result;
  }

  get numberOfConcepts() {
    return this.concepts.length;
  }

  get invalid() {
    return this.validationErrors.length > 0;
  }

  convertToConceptNodeWithoutReferences(conceptFromCsv: CsvConceptDetails): ConceptNode {

    const concept: ConceptNode = this.metaModel.createEmptyConcept(this.vocabulary, conceptFromCsv.id);

    for (const [name, value] of Object.entries(conceptFromCsv.columns)) {

      // special handling for labels
      if (name === 'prefLabel' || name === 'synonym') {
        if (isLiteral(value)) {
          this.validationErrors.push({
            translationKey: 'Property must include a language.' ,
            params: { lineNumber: conceptFromCsv.lineNumber, name: name }
          });
        } else {
          if (name === 'prefLabel') {
            concept.prefLabel = value;
          } else {
            concept.altLabel = value;
          }
        }

        break;
      }

      if (this.conceptMeta.hasProperty(name)) {

        const property = concept.getProperty(name);

        if (isLiteral(value)) {
          if (!property.isLocalizable()) {

            property.literalValue = value;

          } else {
            this.validationErrors.push({
              translationKey: 'Property is not a literal type.' ,
              params: { lineNumber: conceptFromCsv.lineNumber, name: name }
            });
          }
        } else {
          if (property.isLocalizable()) {

            property.setLocalizations(value);

          } else {
            this.validationErrors.push({
              translationKey: 'Property must include a language.' ,
              params: { lineNumber: conceptFromCsv.lineNumber, name: name }
            });
          }
        }
      } else if (!this.conceptMeta.hasReference(name)) {

        this.validationErrors.push({
          translationKey: 'No property or reference found with a name.' ,
          params: { lineNumber: conceptFromCsv.lineNumber, name: name }
        });
      }
    }

    if (concept.hasStatus() && !contains(allStatuses, concept.status)) {
      this.validationErrors.push({
        translationKey: 'Invalid status.' ,
        params: { lineNumber: conceptFromCsv.lineNumber }
      });
    }

    if (allMatching(concept.prefLabel, label => !label.value)) {
      this.validationErrors.push({
        translationKey: 'prefLabel must be set.' ,
        params: { lineNumber: conceptFromCsv.lineNumber }
      });
    }

    return concept;
  }

  convertToConceptNodes(conceptsFromCsv: CsvConceptDetails[]): ConceptNode[] {

    const nodes = conceptsFromCsv.map(concept => this.convertToConceptNodeWithoutReferences(concept));

    for (const conceptFromCsv of conceptsFromCsv) {

      const concept = requireDefined(firstMatching(nodes, n => n.id === conceptFromCsv.id));

      const isMatchingNode = (label: Localization[]) => (node: ConceptNode) =>
        containsAny(node.prefLabel, label, localizationsAreEqual);

      for (const [name, value] of Object.entries(conceptFromCsv.columns)) {

        if (this.conceptMeta.hasReference(name)) {

          const reference = concept.getReference(name);

          if (!isLiteral(value)) {

            if (value.length > 0) {
              const matchingNodes = nodes.filter(isMatchingNode(value));

              if (matchingNodes.length > 0) {
                matchingNodes.forEach(node => reference.values.push(node));
              } else {
                this.validationErrors.push({
                  translationKey: 'Reference does not match any concepts.',
                  params: {lineNumber: conceptFromCsv.lineNumber, name: name}
                });
              }
            }

          } else {
            this.validationErrors.push({
              translationKey: 'Reference must include a language.' ,
              params: { lineNumber: conceptFromCsv.lineNumber, name: name }
            });
          }
        }
      }
    }

    return nodes;
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {

    this.uploading = true;

    this.termedService.saveNodes(this.concepts)
      .subscribe({
        next: () => this.modal.close(),
        error: () => {
          this.importError = true;
          this.uploading = false;
        }
      });
  }
}
