import { Component } from '@angular/core';
import { TermedService } from '../services/termed.service';
import { Graph } from '../entities/graph';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <navigation-bar></navigation-bar>

    <div class="container">

      <div class="row">
        <div class="col-md-12">
          <div class="page-header">
            <h1>Sanastot</h1>
          </div>        
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <ul>
            <li *ngFor="let graph of graphs | async">
              <span *ngFor="let localization of graph.properties.prefLabel; let last = last">
                {{localization.lang}}: {{localization.value}}
                <span *ngIf="!last">,</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  `
})
export class AppComponent {

  graphs: Observable<Graph[]>;

  constructor(private termedService: TermedService) {
    this.graphs = termedService.getGraphs();
  }
}
