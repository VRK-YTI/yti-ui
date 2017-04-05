import { Client } from "elasticsearch";
import {Injectable} from "@angular/core";
import { environment } from "../../environments/environment"

@Injectable()
export class ElasticSearchService {

  private _client: Client;

  constructor() {
    if (!this._client) {
      this._connect();
    }
  }

  private _connect() {
    this._client = new Client({
      host: environment.es_host,
      log: 'trace'
    });
  }

  frontPageSearch(indexName: string, typeName: string, queryObj: Object, resultAmt: number): any {
    if (indexName && typeName && queryObj) {
      return this._client.search({
        index: indexName,
        type: typeName,
        body: {
          query: queryObj,
          sort: [ "_score" ],
          min_score: 1.0,
          highlight : {
            pre_tags : ["<b>"],
            post_tags : ["</b>"],
            fields : {
              "label.fi" : {},
              "label.en": {},
              "label.sv": {}
            }
          },
          from : 0,
          size : resultAmt
        }
      });
    } else {
      return Promise.resolve({});
    }
  }
}