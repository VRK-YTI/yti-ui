import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VocabularyNode } from 'app/entities/node';
import { importApiUrl } from '../../config';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Phase, Progress, Result } from '../progress.component';

@Component({
  selector: 'app-import-vocabulary-xml',
  styleUrls: ['./import-vocabulary-xml.component.scss'],
  template: `
    <div class="xml-modal-container">
      <div class="modal-header">
        <h4 class="modal-title">
          <a [ngClass]="{disabled: !canClose}"><i class="fa fa-times" id="cancel_import_link" (click)="canClose && cancel()"></i></a>
          <span translate>XML import</span>
        </h4>
      </div>
      <div class="modal-body">
        <div class="xml-modal-progress mb-3">
          <app-progress [phases]="progressPhases" (result)="onResult($event)" (pollingError)="onPollingError($event)"></app-progress>
        </div>
        <div class="xml-modal-result-summary">
          <div *ngIf="monitoringError" class="error-result" translate>
            Error while monitoring processing. Close the modal and try refreshing page later.
          </div>
          <span *ngIf="finalResults && !finalResults.resultsError && !finalResults.resultsWarning" class="ok-result" translate
                [translateParams]="{created: finalResults.resultsCreated || '?'}">Import success</span>
          <div *ngIf="finalResults && (finalResults.resultsError || finalResults.resultsWarning)" class="ok-result">
            <span translate
                  [translateParams]="{created: finalResults.resultsCreated || '?', errors: finalResults.resultsError || '0', warnings: finalResults.resultsWarning || '0'}">Import success with errors</span>
            <span *ngIf="finalResults.statusMessage && finalResults.statusMessage.length">
              <a class="showMessagesToggle"
                 (click)="showMessages = !showMessages">{{(showMessages ? 'Hide messages' : 'Show messages') | translate}}</a>.
              <app-clipboard [description]="'JSON'" [value]="generateMessageJSON()"></app-clipboard>
            </span>
          </div>
          <div *ngIf="finalError" class="error-result">
            <div>{{'Import failed' | translate}}:</div>
            <textarea readonly>{{finalError}}</textarea>
          </div>
        </div>
        <div class="xml-modal-result-messages mt-3" *ngIf="showMessages">
          <dl>
            <ng-container *ngFor="let message of finalResults.statusMessage">
              <dt>{{message.targetIdentifier}}</dt>
              <dd class="{{messageClass(message.level)}}">{{message.message}}</dd>
            </ng-container>
          </dl>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" id="import_yes_button" class="btn btn-action confirm" (click)="confirm()"
                [disabled]="!canClose" translate>Close</button>
      </div>
    </div>
  `
})
export class ImportVocabularyXMLComponent {

  @Input() vocabulary: VocabularyNode;
  @Input() importFile: File;

  jobToken?: string;
  httpStatus?: number;
  httpStatusText?: string;
  uploadError?: string;

  requestFullStatus = false;
  finalResults?: any;
  finalError?: any;
  monitoringError: boolean = false;
  showMessages: boolean = false;

  processingResolve: (value?: any | PromiseLike<any>) => void;
  processingReject: (reason?: any) => void;

  progressPhases: Phase[] = [
    new Phase('File upload', this.upload.bind(this)),
    new Phase('Processing', this.process.bind(this), this.pollProgress.bind(this))
  ];

  constructor(private modal: NgbActiveModal, private http: HttpClient) {
  }

  upload(phase: Phase, state: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // TODO: Move upload code to a service!
      const data = new FormData();
      data.append('file', this.importFile);
      this.http.request(new HttpRequest('POST', importApiUrl + '/ntrf/' + this.vocabulary.graphId, data, {
        reportProgress: true,
        responseType: 'json'
      })).subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress && event.total) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            phase.progress.current = percentDone;
          } else if (event instanceof HttpResponseBase) {
            this.httpStatus = event.status;
            this.httpStatusText = event.statusText;
            if (event instanceof HttpResponse) {
              if (event.status === 200 && event.body) {
                const anybody = <any>event.body;
                if (anybody.jobtoken) {
                  this.jobToken = anybody.jobtoken;
                }
              }
            }
          }
        },
        err => {
          const error = (err && err.error && err.error.error) || (err && err.error);
          if (this.httpStatus) {
            this.uploadError = this.httpStatus + ' ' + this.httpStatusText + (error ? ': ' + error : '');
          } else if (error) {
            this.uploadError = error;
          } else {
            this.uploadError = '?';
          }
          reject(this.uploadError);
        },
        () => {
          resolve(this.jobToken);
        }
      );
    });
  }

  process(phase: Phase, state: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.processingResolve = resolve;
      this.processingReject = reject;
    });
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.close();
  }

  pollProgress(phase: Phase, state: any): Promise<Progress> {
    return new Promise((resolve, reject) => {
        this.http.get(importApiUrl + '/status/' + this.jobToken + (this.requestFullStatus ? '?full=true' : ''), {
          responseType: 'json'
        }).subscribe(event => {
          const anybody = <any>event;
          if (anybody.status) {
            switch (anybody.status) {
              case 'QUEUED':
              case 'PREPROCESSING':
                resolve(new Progress());
                break;
              case 'PROCESSING':
                const progress = new Progress();
                if (anybody.processingProgress >= 0 && anybody.processingTotal > 0 && anybody.processingProgress < anybody.processingTotal) {
                  // Reserve (quite arbitrary) 15% of total work for each of preprocessing and postprocessing.
                  progress.total = 1.3 * anybody.processingTotal;
                  progress.current = 0.15 * anybody.processingTotal + anybody.processingProgress;
                }
                resolve(progress);
                break;
              case 'POSTPROCESSING':
                resolve(new Progress());
                break;
              case 'SUCCESS':
              case 'SUCCESS_WITH_ERRORS':
                resolve(new Progress());
                if (this.requestFullStatus) {
                  // TODO: Remove hack when results are reported correctly.
                  if (anybody.resultsCreated == null) {
                    if (anybody.processingProgress && anybody.processingProgress === anybody.processingTotal) {
                      anybody.resultsCreated = anybody.processingProgress - (anybody.resultsError ? anybody.resultsError : 0);
                    }
                  }
                  this.processingResolve(anybody);
                } else {
                  this.requestFullStatus = true;
                }
                break;
              case 'FAILURE':
                resolve(new Progress());
                this.processingReject(anybody);
                break;
              case 'NOT_FOUND':
              default:
                reject();
            }
          } else {
            reject();
          }
        },
        err => {
          reject(err);
        },
        () => {
        }
      );
    });
  }

  onResult(result: Result): void {
    if (result.success) {
      this.finalResults = result.result;
    } else {
      this.finalError = result.result;
    }
  }

  onPollingError(error: boolean): void {
    this.monitoringError = error;
  }

  get canClose(): boolean {
    return this.finalResults || this.finalError || this.monitoringError;
  }

  generateMessageJSON(): () => string {
    return () => {
      if (this.finalResults && this.finalResults.statusMessage) {
        return JSON.stringify(this.finalResults.statusMessage, undefined, 2);
      }
      return '';
    }
  }

  messageClass(level: any): string {
    if (level === 'WARNING') {
      return 'message-warning';
    } else if (level === 'ERROR') {
      return 'message-error';
    }
    return 'message';
  }
}
