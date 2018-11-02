import { Component, Injectable, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EditableService } from '../../services/editable.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { VocabularyNode } from '../../entities/node';

@Component({
  selector: 'app-import-vocabulary-modal',
  styleUrls: ['./import-vocabulary-modal.component.scss'],
  providers: [EditableService],
  template: `
    <ng-container [ngSwitch]="phase">
      <div *ngSwitchCase="'FILE_SELECT'">
        <div class="modal-header">
          <h4 class="modal-title strong">
            <a><i id="close_modal_link" class="fa fa-times" (click)="close()"></i></a>
            <span translate>Import vocabulary</span>
          </h4>
        </div>

        <div class="modal-body">
          <div class="d-inline-block">
            <dl>
              <dt>
                <label translate>File format</label>
              </dt>
              <dd class="fileFormatDropdowns">
                <div ngbDropdown>
                  <button class="btn btn-dropdown" id="file_format_dropdown_button" ngbDropdownToggle>
                    <span>{{format}}</span>
                  </button>
                  <div ngbDropdownMenu aria-labelledby="file_format_dropdown_button">
                    <button id="csv_format_dropdown_button"
                            (click)="format = 'CSV'"
                            class="dropdown-item"
                            [class.active]="format === 'CSV'">
                      CSV
                    </button>
                    <!--<button id="ntrf_xml_format_dropdown_button"
                            (click)="format = 'NTRF-XML'"
                            class="dropdown-item"
                            [class.active]="format === 'NTRF-XML'">
                      NTRF-XML
                    </button>-->
                  </div>
                </div>
                <div ngbDropdown [hidden]="format !== 'CSV'">
                  <button class="btn btn-dropdown" id="csv_charset_dropdown_button" ngbDropdownToggle>
                    <span>{{charset}}</span>
                  </button>
                  <div ngbDropdownMenu aria-labelledby="csv_charset_dropdown_button">
                    <button id="utf8_charset_dropdown_button"
                            (click)="charset = 'UTF-8'"
                            class="dropdown-item"
                            [class.active]="charset === 'UTF-8'">
                      UTF-8
                    </button>
                    <button id="latin15_dropdown_button"
                            (click)="charset = 'ISO-8859-15'"
                            class="dropdown-item"
                            [class.active]="charset === 'ISO-8859-15'">
                      ISO-8859-15
                    </button>
                  </div>
                </div>
              </dd>
            </dl>
          </div>

          <div class="form-group">
            <dl>
              <dt>
                <label for="fileupload_input" translate>File to be uploaded</label>
                <app-required-symbol></app-required-symbol>
              </dt>
              <dd>
                <input name="file" id="fileupload_input" type="file" (change)="onChange($event)"/>
              </dd>
            </dl>
          </div>
        </div>
        <div class="modal-footer">
          <div>
            <button id="upload_file_button"
                    [disabled]="!canSave()"
                    type="button"
                    class="btn btn-action"
                    (click)="uploadFile()"
                    translate>Import</button>
            <button id="cancel_upload_button" type="button" class="btn btn-link" (click)="close()" translate>Cancel</button>
          </div>
        </div>
      </div>
      <app-import-vocabulary-csv *ngSwitchCase="'CSV'" [vocabulary]="vocabulary" [importFile]="file"
                                 [charset]="charset"></app-import-vocabulary-csv>
      <app-import-vocabulary-xml *ngSwitchCase="'XML'" [vocabulary]="vocabulary" [importFile]="file"></app-import-vocabulary-xml>
    </ng-container>
  `
})
export class ImportVocabularyModalComponent {

  @Input() vocabulary: VocabularyNode;
  file?: File;
  format: string = 'CSV';
  charset: string = 'UTF-8';
  phase: 'FILE_SELECT' | 'CSV' | 'XML' = 'FILE_SELECT';

  constructor(private editableService: EditableService,
              private router: Router,
              private modal: NgbActiveModal) {

    // TODO: Handle cancel, "save", etc. Or remove altogether.
    this.editableService.edit();
  }

  close() {
    this.modal.dismiss('cancel');
  }

  canSave() {
    return this.file != null;
  }

  onChange(event: EventTarget) {
    const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    if (target.files != null) {
      this.file = target.files[0];
    } else {
      this.file = undefined;
    }
  }

  uploadFile() {
    if (!this.file) {
      throw new Error('File must be set');
    }

    if (this.file != null) {
      switch (this.format) {
        case 'CSV':
          this.phase = 'CSV';
          break;
        case 'NTRF-XML':
          this.phase = 'XML';
          break;
      }
    }
  }
}

@Injectable()
export class ImportVocabularyModalService {

  constructor(private modalService: ModalService) {
  }

  public open(vocabulary: VocabularyNode): Promise<any> {
    const modalRef = this.modalService.open(ImportVocabularyModalComponent, { size: 'sm' });
    const instance = modalRef.componentInstance as ImportVocabularyModalComponent;
    instance.vocabulary = vocabulary;
    return modalRef.result;
  }
}
