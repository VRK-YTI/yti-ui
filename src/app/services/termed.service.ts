import '../rxjs-operators';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Graph } from '../entities/graph';
import { Observable } from 'rxjs';

const username = 'admin';
const password = 'admin';

@Injectable()
export class TermedService {

  constructor(private http: Http) {
  }

  getGraphs(): Observable<Graph[]> {

    const headers = new Headers();
    headers.append('Authorization', `Basic ${btoa(`${username}:${password}`)}`);

    return this.http.get('/api/graphs', { headers })
      .map(response => response.json() as Graph[]);
  }
}
