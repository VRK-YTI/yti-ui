import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Localization, Localizable } from 'app/entities/localization';
import { flatten } from '../../utils/array';
import { requireDefined } from '../../utils/object';
import { VocabularyNode, ConceptNode } from 'app/entities/node';
import { MetaModelService } from 'app/services/meta-model.service';
import { MetaModel } from 'app/entities/meta';
import { TermedService } from 'app/services/termed.service';

class CsvConceptDetails {

  constructor(public prefLabel: Localization[],
    public definition: Localization[],
    public note: Localization[],
    public example: Localization[],
    public synonym: Localization[]) {
  }

  static createFromCsvRow(csvJsonObject: any): CsvConceptDetails {
    
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

    return new CsvConceptDetails(
      parseLocalizationsForProperty('prefLabel'),
      parseLocalizationsForProperty('definition'),
      parseLocalizationsForProperty('note'),
      parseLocalizationsForProperty('example'),
      parseLocalizationsForProperty('synonym')
    );
  }

  nonEmptyProperties(): {name: string, localizations: Localization[]}[] {

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

  constructor(private modalService: NgbModal) {
  }

  open(importData: any[], vocabulary: VocabularyNode): Promise<any> {
    const modalRef = this.modalService.open(ImportVocabularyModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as ImportVocabularyModalComponent;
    instance.importData = importData;
    instance.vocabulary = vocabulary;
    return modalRef.result;
  }  
}

@Component({
  selector: 'app-import-vocabulary-modal',
  styleUrls: ['./import-vocabulary-modal.component.scss'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <a><i class="fa fa-times" (click)="cancel()"></i></a>
        <span translate>Confirm import</span>
      </h4>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-8">
          <span translate>Importing</span> {{numberOfConcepts}} <span translate>concepts</span>         
        </div>
        <div class="col-md-4">
          <div class="pull-right">
            <div class="error-alert alert-danger" role="alert" *ngIf="importError">
              <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
              <span translate>Import failed</span>
            </div>
            <button type="button" class="btn btn-secondary confirm" (click)="confirm()" translate>Yes</button>
            <button type="button" class="btn btn-default cancel" (click)="cancel()" translate>Cancel</button>  
          </div>      
        </div>        
      </div>
      <div>
        <div *ngFor="let concept of conceptsFromCsv">
          <div *ngFor="let property of properties(concept)"><b>{{property.name}}:</b>
            <div *ngFor="let localization of property.localizations">{{ localization.lang }}: {{ localization.value }}</div>
          </div>       
          <br />
        </div>
      </div>
    </div>    
    <div class="modal-footer"></div>
  `
})
export class ImportVocabularyModalComponent implements OnInit {

  @Input() importData: any[];
  @Input() vocabulary: VocabularyNode;

  processedConceptData: CsvConceptDetails[];
  importError = false;

  constructor(private modal: NgbActiveModal,
              private metaModelService: MetaModelService,
              private termedService: TermedService
            ) {
  }

  ngOnInit(): void {
    const data: any[] = this.importData;
    this.processedConceptData = data.map(datum => CsvConceptDetails.createFromCsvRow(datum));
  }

  get conceptsFromCsv() {
    return this.processedConceptData;
  }

  get numberOfConcepts() {
    return this.conceptsFromCsv ? this.conceptsFromCsv.length : 0;
  }

  properties(concept: CsvConceptDetails) {
    return concept.nonEmptyProperties();
  }

  convertToConceptNode(conceptFromCsv: CsvConceptDetails, metaModel: MetaModel): ConceptNode {

    const concept: ConceptNode = metaModel.createEmptyConcept(this.vocabulary);

    concept.prefLabel = conceptFromCsv.prefLabel;
    concept.definition = conceptFromCsv.definition;
    concept.note = conceptFromCsv.note;
    concept.example = conceptFromCsv.example;
    concept.altLabel = conceptFromCsv.synonym;

    return concept;
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    const conceptsToSave = this.conceptsFromCsv;

    this.metaModelService.getMeta(this.vocabulary.graphId).subscribe(metaModel =>
      this.termedService.saveNodes(conceptsToSave.map(concept => this.convertToConceptNode(concept, metaModel)))
        .subscribe({
          next: () => this.modal.close(),
          error: () => this.importError = true
        })
    );
  }
}
