import { Component } from '@angular/core';
import { TermedService } from '../services/termed.service';
import { Graph } from '../entities/graph';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  graphs: Observable<Graph[]>;

  constructor(private termedService: TermedService) {
    this.graphs = termedService.getGraphs();
  }
}

