import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ignoreModalClose } from 'app/utils/modal';
import { Localization } from 'app/entities/localization';
import { flatten } from '../../utils/array';

@Injectable()
export class ImportVocabularyModalService {

  constructor(private modalService: NgbModal) {
  }

  open(importData: any[]): Promise<any> {
    const modalRef = this.modalService.open(ImportVocabularyModalComponent, { size: 'lg' });
    const instance = modalRef.componentInstance as ImportVocabularyModalComponent;
    instance.importData = importData;
    return modalRef.result;
  }
  
}

// Testing these functions here. This is not necessarily a final place for them.

function splitValuesAsOwnLocalizations(localization: Localization): Localization[] {
  return localization.value.split('\r\n').map(v => ({ lang: localization.lang, value: v}));
}

function parseLocalizationsForProperty(csvJsonObject: any, propertyName: string): Localization[] {

  const entries: [string, string][] = Object.entries(csvJsonObject);

  const entriesRelatedToProperty = entries.filter(([key, value]) => key.startsWith(propertyName) && value !== '');

  const localizations: Localization[] = entriesRelatedToProperty.map(([key, value]: [string, string]) => {
    const language = key.replace(propertyName + '_', '');
    return { lang: language, value: value };
  });

  const result: Localization[][] = localizations.map(localization => splitValuesAsOwnLocalizations(localization));

  return flatten(result);
}


@Component({
  selector: 'app-import-vocabulary-modal',
  styleUrls: ['./import-vocabulary-modal.component.scss'],
  template: `
    <div class="modal-header modal-header-warning">
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
            <button type="button" class="btn btn-secondary confirm" (click)="confirm()" translate>Yes</button>
            <button type="button" class="btn btn-default cancel" (click)="cancel()" translate>Cancel</button>  
          </div>      
        </div>        
      </div>
      <div>
        <div *ngFor="let concept of concepts">
          <div *ngFor="let prefLabel of concept.prefLabel"><b>prefLabel ({{ prefLabel.lang }}):</b> {{ prefLabel.value }}</div>
          <div *ngFor="let definition of concept.definition"><b>definition ({{ definition.lang }}):</b> {{ definition.value }}</div>
          <div *ngFor="let note of concept.note"><b>note ({{ note.lang }}):</b> {{ note.value }}</div>
          <div *ngFor="let example of concept.example"><b>example ({{ example.lang }}):</b> {{ example.value }}</div>
          <div *ngFor="let synonym of concept.synonym"><b>synonym ({{ synonym.lang }}):</b> {{ synonym.value }}</div>          
          <br />
        </div>      
        <!--<pre>{{processedConceptData | json}}</pre>-->
      </div>
      
    </div>    
    <div class="modal-footer">

    </div>

  `
})
export class ImportVocabularyModalComponent implements OnInit {

  @Input() importData: any[];
  processedConceptData: any[];

  constructor(private modal: NgbActiveModal) {
  }

  ngOnInit(): void {

    const data: any[] = this.importData;

    const processedData = data.map((datum: any) => {
      
      const prefLabel: Localization[] = parseLocalizationsForProperty(datum, 'prefLabel');
      const definition: Localization[] = parseLocalizationsForProperty(datum, 'definition');
      const note: Localization[] = parseLocalizationsForProperty(datum, 'note');
      const example: Localization[] = parseLocalizationsForProperty(datum, 'example');
      const synonym: Localization[] = parseLocalizationsForProperty(datum, 'synonym');
    
      return { prefLabel, definition, note, example, synonym };
    });

    this.processedConceptData = processedData;

  }

  get concepts() {
    return this.processedConceptData;
  }

  get numberOfConcepts() {
    return this.processedConceptData ? this.processedConceptData.length : 0;
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }
}
