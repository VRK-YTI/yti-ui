import {Component, AfterViewInit, Output, EventEmitter, NgZone, ChangeDetectionStrategy} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Subject} from "rxjs";
import {ElasticSearchService} from "../../services/elasticsearch.service";
import {LanguageService} from "../../services/language.service";

@Component({
  selector: "autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AutoComplete implements AfterViewInit {

  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();

  searchTextModel: string;
  results$: Subject<Array<any>> = new Subject<Array<any>>();
  message: string = "";
  active: boolean = false;
  searchText: FormControl = new FormControl("");

  constructor(private es: ElasticSearchService, private _ngZone: NgZone, private ls: LanguageService) {
    this.results$.subscribe((res) => {
      this.found.emit(res);
    });
  }

  onBlur() {
    this.active = false;
    this.searchTextModel = "";
  }

  onFocus() {
    this.active = true;
  }

  ngAfterViewInit() {
    this.searchText
        .valueChanges
        .map((ẗext: any) => ẗext ? ẗext.trim() : "")                                             // ignore spaces
        .do(searchString => searchString && searchString.length > 2 ? this.message = "searching..." : this.message = "")
        .debounceTime(500)                                                                      // wait when input completed
        .distinctUntilChanged()
        .switchMap(searchString => {
          return new Promise<Array<any>>((resolve, reject) => {
            this._ngZone.runOutsideAngular(() => {                                          // perform search operation outside of angular boundaries
              this.es.frontPageSearch("concepts", "concept", this._frontPageQuery(searchString))
                  .then((searchResult: any) => {
                    this._ngZone.run(() => {
                      let results: Array<any> = ((searchResult.hits || {}).hits || [])// extract results from elastic response
                          .map((hit: any) => {
                            console.log(hit);
                            let prefLabel = hit.inner_hits["properties.prefLabel"];
                            let prefLabelXl = hit.inner_hits["references.prefLabelXl"];
                            if(prefLabel && prefLabel.hits.total > 0) {
                              return {
                                graphId: hit._source.type.graph.id,
                                conceptId: hit._source.id,
                                value: prefLabel.hits.hits[0]._source.value
                              }
                            } else if(prefLabelXl && prefLabelXl.hits.total > 0) {
                              return {
                                graphId: hit._source.type.graph.id,
                                conceptId: hit._source.id,
                                value: prefLabelXl.hits.hits[0]._source.properties.prefLabel[0].value
                              }
                            }
                            return hit._source;
                          });
                      if (results.length > 0) {
                        this.message = "";
                      }
                      else if (searchString.length > 2 && this.searchTextModel && this.searchTextModel.trim()) {
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
            });
          });
        })
        .subscribe(this.results$);
  }

  resultSelected(result: any) {
    this.selected.next(result);
  }

  _frontPageQuery(searchStr: string): any {
    if (searchStr && searchStr.length > 2) {
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
                        match: {
                          "properties.prefLabel.value": {
                            query: searchStr,
                            // operator: "and"
                            // minimum_should_match: "50%"
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
                        match: {
                          "references.prefLabelXl.properties.prefLabel.value": {
                            query: searchStr,
                            // operator: "and"
                            // minimum_should_match: "50%"
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
