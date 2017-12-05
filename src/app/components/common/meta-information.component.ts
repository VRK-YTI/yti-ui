import { Component, Input } from '@angular/core';
import { Node } from 'app/entities/node';

@Component({
  selector: 'app-meta-information',
  styleUrls: ['./meta-information.component.scss'],
  template: `
    <div *ngIf="node">
      
      <hr />
      
      <div class="row">
        <div class="col-sm-6">
          <div class="form-group">
            <label translate>Created at</label>
            <p class="form-control-static">{{node.createdDate | timestamp}}</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="form-group">
            <label translate>Created by</label>
            <p class="form-control-static">{{node.createdBy}}</p>
          </div>
        </div>
        <div class="col-sm-6" *ngIf="showModified">
          <div class="form-group">
            <label translate>Modified at</label>
            <p class="form-control-static">{{node.lastModifiedDate | timestamp}}</p>
          </div>
        </div>
        <div class="col-sm-6" *ngIf="showModified">
          <div class="form-group">
            <label translate>Modified by</label>
            <p class="form-control-static">{{node.lastModifiedBy}}</p>
          </div>
        </div>
        <div class="col-sm-12">
          <div class="form-group">
            <label>URI</label>
            <p class="form-control-static">{{node.uri}}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MetaInformationComponent {

  @Input() node: Node<any>;
  @Input() showModified = true;
}
