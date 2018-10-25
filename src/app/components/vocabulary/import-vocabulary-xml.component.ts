import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VocabularyNode } from 'app/entities/node';
import { importApiUrl } from '../../config';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-vocabulary-xml',
  styleUrls: ['./import-vocabulary-xml.component.scss'],
  template: `
    <div *ngIf="uploading || processing">
      <app-ajax-loading-indicator></app-ajax-loading-indicator>
    </div>

    <div *ngIf="!uploading && !processing">
      <div class="modal-header">
        <h4 class="modal-title">
          <a><i class="fa fa-times" id="cancel_import_link" (click)="cancel()"></i></a>
          <span translate>Import results</span>
        </h4>
      </div>
      <div class="modal-body">
        <div class="row mb-2">
          <div class="col-md-12">
            <span *ngIf="!errorMessage" class="success" translate>Import finished succesfully</span>
            <div *ngIf="errorMessage"><span *ngIf="errorMessage" class="error" translate>Import failed</span>: {{errorMessage}}</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" id="import_yes_button" class="btn btn-action confirm" (click)="confirm()" translate>Close</button>
      </div>
    </div>
  `
})
export class ImportVocabularyXMLComponent implements OnInit {

  @Input() vocabulary: VocabularyNode;
  @Input() importFile: File;

  uploading = false;
  processing = false;
  status?: string;
  errorMessage?: string;

  constructor(private modal: NgbActiveModal, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.uploading = true;

    // TODO: Move upload code to a service!
    const data = new FormData();
    data.append('file', this.importFile);
    this.http.request(new HttpRequest('POST', importApiUrl + '/ntrf/' + this.vocabulary.graphId, data, {
      reportProgress: true,
      responseType: 'json'
    })).subscribe(
      event => {
        if (event.type == HttpEventType.UploadProgress && event.total) {
          // const percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.status = event.status + ' ' + event.statusText;
          if (event.status === 200 && event.body) {
            const anybody = <any> event.body;
            if (anybody.jobtoken) {
              this.processing = true;
              this.pollProgress(anybody.jobtoken);
            }
          }
        }
      },
      err => {
        const error = err && err.error && err.error.error;
        if (this.status) {
          this.errorMessage = this.status + (error ? ': ' + error : '');
        } else if (error) {
          this.errorMessage = error;
        } else {
          this.errorMessage = '?';
        }
        this.uploading = false;
      },
      () => {
        this.uploading = false;
      }
    );
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }

  pollProgress(token: string) {
    this.http.get(importApiUrl + '/status/' + token, {
      responseType: 'json'
    }).subscribe(event => {
        const anybody = <any> event;
        if (anybody.status === 'Processing') {
          setTimeout(() => this.pollProgress(token), 500);
        } else if (anybody.status === 'Ready') {
          this.processing = false;
        } else {
          this.progressError();
        }
      },
      err => {
        this.progressError();
      },
      () => {
      }
    );
  }

  progressError() {
    if (!this.errorMessage) {
      this.errorMessage = 'Monitoring failed. Import status unknown.';
    }
    this.processing = false;
  }
}
