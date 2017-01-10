import '../rxjs-operators';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Graph } from '../entities/graph';
import { Observable } from 'rxjs';

@Injectable()
export class TermedService {

  constructor(private http: Http) {
  }

  getGraphs(): Observable<Graph[]> {
    return this.http.get('/api/graphs')
      .map(response => response.json() as Graph[]);
  }
}
