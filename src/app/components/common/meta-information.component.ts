import { Component, Input } from '@angular/core';
import { Node } from '../../entities/node';

@Component({
  selector: 'app-meta-information',
  styleUrls: ['./meta-information.component.scss'],
  template: `
    <div *ngIf="node">
      
      <hr />
      
      <div class="row">
        <div class="col-sm-6">
          <dl>
            <dt translate>Created at</dt>
            <dd>{{node.createdDate | timestamp}}</dd>
          </dl>
        </div>
        <div class="col-sm-6">
          <dl>
            <dt translate>Created by</dt>
            <dd>{{node.createdBy}}</dd>
          </dl>
        </div>
        <div class="col-sm-6" *ngIf="showModified">
          <dl>
            <dt translate>Modified at</dt>
            <dd>{{node.lastModifiedDate | timestamp}}</dd>
          </dl>
        </div>
        <div class="col-sm-6" *ngIf="showModified">
          <dl>
            <dt translate>Modified by</dt>
            <dd>{{node.lastModifiedBy}}</dd>
          </dl>
        </div>
        <div class="col-sm-12">
          <dl>
            <dt>URI</dt>
            <dd>{{node.uri}}</dd>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class MetaInformationComponent {

  @Input() node: Node<any>;
  @Input() showModified = true;
}
