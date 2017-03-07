import { Component, Input } from '@angular/core';
import { Node } from '../entities/node';

@Component({
  selector: 'vocabulary',
  styleUrls: ['./vocabulary.component.scss'],
  template: `
    <ngb-accordion>
      <ngb-panel>
        <template ngbPanelTitle>
          <div class="main-panel-header">
            <h2>{{conceptScheme.label | translateValue}} <accordion-chevron></accordion-chevron></h2>
          </div>
        </template>
        <template ngbPanelContent>
          <div class="row">
            <div class="col-md-12">
              <form class="editable">
              
                <div class="row">
                  <div class="col-md-12">
                    <editable-buttons (save)="save()"></editable-buttons>
                  </div>
                </div>
              
                <property [value]="property" *ngFor="let property of conceptScheme | properties"></property>
                <reference [value]="reference" *ngFor="let reference of conceptScheme | references"></reference>
                
                <dl class="row">
                  <dt class="col-md-3" translate>Id</dt>
                  <dd class="col-md-9">{{conceptScheme.uri}}</dd>
                </dl>
                
                <dl class="row">
                  <dt class="col-md-3" translate>Created at</dt>
                  <dd class="col-md-9">{{conceptScheme.createdDate | timestamp}}</dd>
                </dl>
                
                <dl class="row">
                  <dt class="col-md-3" translate>Modified at</dt>
                  <dd class="col-md-9">{{conceptScheme.lastModifiedDate | timestamp}}</dd>
                </dl>
              </form>
            </div>
          </div>
        </template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class VocabularyComponent {

  @Input('value') conceptScheme: Node<'TerminologicalVocabulary'>;

  save() {
    // TODO
    console.log('saving vocabulary');
  }
}
