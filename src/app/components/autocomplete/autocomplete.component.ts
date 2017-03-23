import {Component, AfterViewInit, NgZone, ChangeDetectionStrategy} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Subject} from "rxjs";
import {ElasticSearchService} from "../../services/elasticsearch.service";
import {LanguageService} from "../../services/language.service";

@Component({
  selector: "autocomplete",
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <input [(ngModel)]="searchString"
               type="text"
               class="form-control"
               (blur)="onBlur()"
               [formControl]="searchText"
               [placeholder]="'Search concept...' | translate" />
      <div class="sb-message" *ngIf="!!message"><span>{{ message }}</span></div>
      <!-- Search results -->
      <div class="sb-searchresults">
          <ul class="sb-results-dropdown-menu" >
              <li *ngFor="let result of results$ | async">
                  <span [routerLink]="['/concepts', result.graphId, 'concept', result.conceptId]"
                     [innerHTML]="result.value"></span>
              </li>
          </ul>
      </div>
  `
})

export class AutoComplete implements AfterViewInit {

  results$: Subject<Array<any>> = new Subject<Array<any>>();

  message: string = "";

  searchText: FormControl = new FormControl("");
  searchString: string;

  MIN_SEARCH_STRING_LENGTH: number = 3

  constructor(private es: ElasticSearchService, private _ngZone: NgZone, private ls: LanguageService) {}

  onBlur() {
    this.searchString = "";
  }

  ngAfterViewInit() {
    this.searchText
        .valueChanges
        .map((ẗext: any) => ẗext ? ẗext.trim() : "")      // ignore spaces
        .do(searchString => {
          searchString && searchString.length >= this.MIN_SEARCH_STRING_LENGTH ? this.message = "searching..." : this.message = ""
        })
        .debounceTime(500)                                 // wait when input completed
        .distinctUntilChanged()
        .switchMap(searchString => {
          return new Promise<Array<any>>((resolve, reject) => {
            this._ngZone.runOutsideAngular(() => {                                        // perform search operation outside of angular boundaries
              let results: Array<any> = []
              if(searchString.length >= this.MIN_SEARCH_STRING_LENGTH) {
                this.es.frontPageSearch("concepts", "concept", this._frontPageQuery(searchString), 15)  // Get max 15 results
                  .then((searchResult: any) => {
                    this._ngZone.run(() => {
                      let results: Array<any> = ((searchResult.hits || {}).hits || [])  // extract results from elastic response
                          .map((hit: any) => {
                            console.log(hit);
                            let prefLabel = hit.highlight["properties.prefLabel.value"];
                            let prefLabelXl = hit.highlight["references.prefLabelXl.properties.prefLabel.value"];
                            if (prefLabel && prefLabel.length > 0) {
                              return {
                                graphId: hit._source.type.graph.id,
                                conceptId: hit._source.id,
                                value: prefLabel[0]
                              }
                            } else if (prefLabelXl && prefLabelXl.length > 0) {
                              return {
                                graphId: hit._source.type.graph.id,
                                conceptId: hit._source.id,
                                value: prefLabelXl[0]
                              }
                            }
                            return hit._source;
                          });
                      if (results.length > 0) {
                        this.message = "";
                      } else if (this.searchString && this.searchString.trim()) {
                        this.message = "nothing was found";
                      }
                      resolve(results);
                    });
                  })
                  .catch((error: any) => {
                    this._ngZone.run(() => {
                      reject(error);
                    });
                });
              } else {
                resolve(results);
              }
            });
          });
        })
        .subscribe(this.results$);
  }

  _frontPageQuery(searchStr: string): any {
    if (searchStr) {
      return {
        bool: {
          should: [
            {
              nested: {
                inner_hits : {},
                path: "properties.prefLabel",
                query: {
                  bool: {
                    filter: {
                      term: {
                        "properties.prefLabel.lang": this.ls.language
                      }
                    },
                    should: [
                      {
                        match: { // Try match_phrase_prefix also
                          "properties.prefLabel.value": {
                            query: searchStr,
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            {
              nested: {
                inner_hits : {},
                path: "references.prefLabelXl",
                query: {
                  bool: {
                    filter: {
                      term: {
                        "references.prefLabelXl.properties.prefLabel.lang": this.ls.language
                      }
                    },
                    should: [
                      {
                        match: { // Try match_phrase_prefix also
                          "references.prefLabelXl.properties.prefLabel.value": {
                            query: searchStr,
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }

        // bool: {
        //   should: [
        //     {
        //       bool: {
        //         filter: {
        //           term: {
        //             "properties.prefLabel.lang": this.ls.language
        //           }
        //         },
        //         should: [
        //           {
        //             match: {
        //               "properties.prefLabel.value": {
        //                 query: searchStr,
        //                 // operator: "and"
        //                 // minimum_should_match: "50%"
        //               }
        //             }
        //           }
        //         ]
        //       }
        //     },
        //     {
        //       bool: {
        //         filter: {
        //           term: {
        //             "references.prefLabelXl.properties.prefLabel.lang": this.ls.language
        //           }
        //         },
        //         should: [
        //           {
        //             match: {
        //               "references.prefLabelXl.properties.prefLabel.value": {
        //                 query: searchStr,
        //                 // operator: "and"
        //                 // minimum_should_match: "50%"
        //               }
        //             }
        //           }
        //         ]
        //       }
        //     }
        //   ]
        // }
      }
    }
    return null;
  }
}
