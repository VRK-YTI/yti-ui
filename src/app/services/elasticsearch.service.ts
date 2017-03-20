import { Client } from "elasticsearch";
import {Injectable} from "@angular/core";
import { TermedHttp } from './termed-http.service';

@Injectable()
export class ElasticSearchService {

  private _client: Client;
  // private importUrl = 'http://termed.csc.fi/api/ext.json?max=-1&typeId=Concept&select.properties=prefLabel&select.referrers=&select.references=prefLabelXl&select.audit=true';
  private elasticSearchBaseUrl: string = 'http://localhost:9200';
  private indexName: string = 'concepts';
  private typeName: string = 'concept';

  constructor(private http: TermedHttp) {
    if (!this._client) {
      this._connect();
      this.indexExists(this.indexName).then(exists => {
        if(!exists) {
          this._createIndexWithNgramAutocomplete(this.indexName).then(() => {
            this._createConceptTypeMapping(this.indexName, this.typeName).then(() => {
              this._getConcepts().subscribe(importables => {
                for (let concept in importables) {
                  this._addToIndex(this.indexName, this.typeName, importables[concept].id, importables[concept]).then(() => console.log("Concept added to elasticsearch with id " + importables[concept].id));
                }
              });
            });
          });
        }
      });
    }
  }

  private _connect() {
    this._client = new Client({
      host: this.elasticSearchBaseUrl,
      log: 'trace'
    });
  }

  private _getConcepts() {
    // return this.http.get(this.importUrl).map(data => {
    //   return data.json();
    // });

    return this.http.get('dist/ext.json').map(data => {
      return data.json();
    });
  }

  private _createIndexWithNgramAutocomplete(indexName: string) {
    return this._client.indices.create({
      index: indexName,
      body: {
        settings: {
          analysis: {
            tokenizer: {
              ngram_tokenizer: {
                type: "edge_ngram",
                min_gram: 3,
                max_gram: 15,
                token_chars: [ "letter", "digit" ]
              }
            },
            analyzer: {
              autocomplete: {
                type: "custom",
                tokenizer: "ngram_tokenizer",
                filter: [
                  "lowercase"
                ]
              }
            }
          }

        }
      }
    });
  }

  private _createConceptTypeMapping(indexName: string, typeName: string) {
    return this._client.indices.putMapping({
      index: indexName,
      type: typeName,
      body: {
        dynamic: false,
        properties : {
          id : {
            type : "text",
            fields : {
              keyword : {
                type : "keyword",
                ignore_above : 256
              }
            }
          },
          properties : {
            properties : {
              prefLabel : {
                type: "nested",
                properties : {
                  lang : {
                    type : "keyword",
                    ignore_above : 256
                  },
                  value : {
                    type : "text",
                    analyzer : "autocomplete",
                  }
                }
              },
              note : {
                type: "nested",
                properties : {
                  lang : {
                    type : "keyword",
                    ignore_above : 256
                  },
                  value : {
                    type : "text"
                  }
                }
              },
              definition : {
                type: "nested",
                properties : {
                  lang : {
                    type : "keyword",
                    ignore_above : 256
                  },
                  value : {
                    type : "text"
                  }
                }
              }
            }
          },
          references : {
            properties : {
              prefLabelXl : {
                type: "nested",
                properties : {
                  properties : {
                    properties : {
                      prefLabel : {
                        properties : {
                          lang : {
                            type : "keyword",
                            ignore_above : 256
                          },
                          value : {
                            type : "text",
                            analyzer: "autocomplete"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          type : {
            properties : {
              graph : {
                properties : {
                  id : {
                    type : "text",
                    fields : {
                      keyword : {
                        type : "keyword",
                        ignore_above : 256
                      }
                    }
                  }
                }
              },
            }
          },
        }
      }
    });
  }

  frontPageSearch(indexName: string, typeName: string, queryObj: Object): any {
    if (indexName && typeName && queryObj) {
      return this._client.search({
        index: indexName,
        type: typeName,
        body: {
          query: queryObj,
          sort: [ "_score" ],
          from : 0,
          size : 20,
          _source: [
            "id",
            "type.graph.id",
          //   "properties.prefLabel.lang",
          //   "properties.prefLabel.value",
          //   "references.prefLabelXl.properties.prefLabel.lang",
          //   "references.prefLabelXl.properties.prefLabel.value"
          ]
        }
      });
    } else {
      return Promise.resolve({});
    }
  }

  private _addToIndex(indexName: string, docType: string, id: string, docJson: any): any {
    return this._client.create({
      index: indexName,
      type: docType,
      id: id,
      body: docJson
    });
  }

  indexExists(indexName: string): PromiseLike<boolean> {
    return this._client.indices.exists({index: indexName});
  }
}