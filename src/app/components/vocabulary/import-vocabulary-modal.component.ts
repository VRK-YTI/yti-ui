import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Localization } from 'yti-common-ui/types/localization';
import { firstMatching, flatten, contains, allMatching } from 'yti-common-ui/utils/array';
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
                | 'literal'
                | 'reference';

interface ValidationError {
  translationKey: string;
  params?: {};
}

interface ColumnDetails {
  [name: string]: ColumnType;
}

interface LocalizedColumn {
  type: 'localized';
  value: Localization[];
}

interface LiteralColumn {
  type: 'literal';
  value: string;
}

interface ReferenceColumn {
  type: 'reference';
  value: Localization[];
}

type Column = LocalizedColumn
            | LiteralColumn
            | ReferenceColumn;

class CsvConceptDetails {

  id = uuid();
  columns: { [name: string]: Column } = {};

  constructor(csvJsonObject: any,
              columnDetails: ColumnDetails,
              public lineNumber: number) {

    function splitValuesAsOwnLocalizations(localization: Localization): Localization[] {
      return localization.value.split('\r\n').map(v => ({ lang: localization.lang, value: v }));
    }

    function parseLocalizationsForProperty(propertyName: string): Localization[] {

      const entriesRelatedToProperty = Object.entries(csvJsonObject)
        .filter(([key]) => key.startsWith(propertyName));

      const localizations = entriesRelatedToProperty.map(([key, value]) => {
        return {
          lang: key.replace(propertyName + '_', ''),
          value: value
        };
      });

      return flatten(localizations.map(localization => splitValuesAsOwnLocalizations(localization))).filter(l => !!l.value);
    }

    function parseLiteral(propertyName: string): string {
      return csvJsonObject[propertyName];
    }

    for (const [propertyName, columnType] of Object.entries(columnDetails)) {
      switch (columnType) {
        case 'localized':
          this.columns[propertyName] = { type: columnType, value: parseLocalizationsForProperty(propertyName) };
          break;
        case 'reference':
          this.columns[propertyName] = { type: columnType, value: parseLocalizationsForProperty(propertyName) };
          break;
        case 'literal':
          this.columns[propertyName] = { type: columnType, value: parseLiteral(propertyName) };
          break;
        default:
          assertNever(columnType);
      }
    }
  }
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

        Papa.parse(this.importFile, {
          header: true,
          skipEmptyLines: true,
          newline: '\r\n',
          complete: results => {

            const conceptMeta = metaModel.getNodeMeta(this.vocabulary.graphId, 'Concept');
            const columnDetails = this.parseColumnDetails(results.meta.fields, conceptMeta);

            if (!this.invalid) {
              const conceptsFromCsv = results.data.map((datum, index) => new CsvConceptDetails(datum, columnDetails, index + 2));
              this.concepts = this.convertToConceptNodes(conceptsFromCsv, metaModel);
            }

            this.uploading = false;
          }
        });
      });
  }

  private parseColumnDetails(columnNames: string[], conceptMeta: NodeMeta): ColumnDetails {

    const result: ColumnDetails = {};

    for (const columnName of columnNames) {

      // TODO validation, for example for multiple underscores
      const underscorePosition = columnName.indexOf('_');
      const isLocalized = underscorePosition !== -1;
      const name = isLocalized ? columnName.substr(0, underscorePosition) : columnName;

      // special handling for labels
      if (name === 'prefLabel' || name === 'synonym') {
        if (!isLocalized) {
          this.validationErrors.push({
            translationKey: 'Property must include a language.',
            params: { name: name }
          });
        }

        result[name] = 'localized';

      } else if (conceptMeta.hasProperty(name)) {

        const property = conceptMeta.getProperty(name);

        if (property.isLocalizable()) {
          if (!isLocalized) {
            this.validationErrors.push({
              translationKey: 'Property must include a language.',
              params: { name: name }
            });
          }

          result[name] = 'localized';

        } else {
          if (isLocalized) {
            this.validationErrors.push({
              translationKey: 'Property is not a literal type.',
              params: { name: name }
            });
          }

          result[name] = 'literal';
        }

      } else if (conceptMeta.hasReference(name)) {
        if (!isLocalized) {
          this.validationErrors.push({
            translationKey: 'Reference must include a language.' ,
            params: { name: name }
          });
        }

        result[name] = 'reference';

      } else {
        this.validationErrors.push({
          translationKey: 'No property or reference found with a name.' ,
          params: { name: name }
        });
      }
    }

    return result;
  }

  get numberOfConcepts() {
    return this.concepts.length;
  }

  get invalid() {
    return this.validationErrors.length > 0;
  }

  convertToConceptNodeWithoutReferences(conceptFromCsv: CsvConceptDetails, metaModel: MetaModel): ConceptNode {

    const concept: ConceptNode = metaModel.createEmptyConcept(this.vocabulary, conceptFromCsv.id);

    for (const [name, column] of Object.entries(conceptFromCsv.columns)) {

      // special handling for labels
      if (name === 'prefLabel') {
        concept.prefLabel = column.value as Localization[];
      } else if (name === 'synonym') {
        concept.altLabel = column.value as Localization[];
      } else {
        switch (column.type) {
          case 'localized':
            concept.getProperty(name).setLocalizations(column.value);
            break;
          case 'literal':
            concept.getProperty(name).literalValue = column.value;
            break;
          case 'reference':
            // references are handled in a second sweep
            break;
          default:
            assertNever(column);
        }
      }
    }

    if (concept.hasStatus() && !contains(allStatuses, concept.status)) {
      this.validationErrors.push({
        translationKey: 'Invalid status.' ,
        params: { lineNumber: conceptFromCsv.lineNumber, value: concept.status }
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

  convertToConceptNodes(conceptsFromCsv: CsvConceptDetails[], metaModel: MetaModel): ConceptNode[] {

    const nodes = conceptsFromCsv.map(concept => this.convertToConceptNodeWithoutReferences(concept, metaModel));

    const isMatchingNode = (label: Localization) => (node: ConceptNode) =>
      contains(node.prefLabel, label, localizationsAreEqual);

    for (const conceptFromCsv of conceptsFromCsv) {

      const concept = requireDefined(firstMatching(nodes, n => n.id === conceptFromCsv.id));

      for (const [name, column] of Object.entries(conceptFromCsv.columns)) {

        if (column.type === 'reference') {

          const reference = concept.getReference(name);

          for (const localization of column.value) {
            const matchingNodes = nodes.filter(isMatchingNode(localization));
            matchingNodes.forEach(node => reference.values.push(node));

            if (matchingNodes.length === 0) {
              this.validationErrors.push({
                translationKey: 'Reference does not match any concepts.',
                params: { lineNumber: conceptFromCsv.lineNumber, name: name, value: localization.value }
              });
            }
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
