import { Injectable } from '@angular/core';
import { Graph } from '../entities/graph';
import { Observable } from 'rxjs';
import { TermedHttp } from './termed-http.service';

@Injectable()
export class TermedService {

  constructor(private http: TermedHttp) {
  }

  getGraphs(): Observable<Graph[]> {
    return this.http.get('/api/graphs')
      .map(response => response.json() as Graph[]);
  }
}
