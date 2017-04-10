import { Component, AfterViewInit, NgZone, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { ElasticSearchService } from "../../services/elasticsearch.service";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "autocomplete",
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="input-group input-group-lg input-group-search">
        <input [(ngModel)]="searchString"
               type="text"
               class="form-control"
               (blur)="onBlur()"
               [formControl]="searchText"
               [placeholder]="'Search concept...' | translate" />
      </div>
      <div class="sb-message" *ngIf="!!message"><span>{{ message }}</span></div>
      <!-- Search results -->
      <div class="sb-searchresults">
          <ul class="sb-results-dropdown-menu" >
              <li *ngFor="let result of results$ | async">
                  <span [routerLink]="['/concepts', result.graphId, 'concept', result.conceptId]"
                     [innerHTML]="result.label + '<br><em class=\\'font-small\\'>' + result.vocabulary + '</em>'" [ngbPopover]="popContent" placement="right" triggers="mouseenter:mouseleave"></span>
                   
                 <template #popContent>
                    <div markdown [value]="result.definition"></div>
                 </template>  
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

  LABEL_FI_TAG: string = "label.fi";
  LABEL_SV_TAG: string = "label.sv";
  LABEL_EN_TAG: string = "label.en";
  ALTLABEL_FI_TAG: string = "altLabel.fi";
  ALTLABEL_SV_TAG: string = "altLabel.sv";
  ALTLABEL_EN_TAG: string = "altLabel.en";
  DEFINITION_FI_TAG: string = "definition.fi";
  DEFINITION_SV_TAG: string = "definition.sv";
  DEFINITION_EN_TAG: string = "definition.en";

  EXACT_TAG: string = ".exact";

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

                            let source = hit._source;
                            let matchedFields: Array<string> = hit.matched_queries;
                            let highlight = hit.highlight;
                            let label = '';
                            let labelHi = '';
                            let definition = '';
                            let vocabulary = '';

                            if(this.ls.language === "fi" && matchedFields.includes(this.LABEL_FI_TAG)) {
                              label = source.label.fi;
                              labelHi = highlight[this.LABEL_FI_TAG][0];
                              vocabulary = this._getVocabularyLabel(source, "fi");
                            } else if(this.ls.language === "en" && matchedFields.includes(this.LABEL_EN_TAG)) {
                              label = source.label.en;
                              labelHi = highlight[this.LABEL_EN_TAG][0];
                              vocabulary = this._getVocabularyLabel(source, "en");
                            } else if(matchedFields.includes(this.LABEL_FI_TAG)) {
                              label = source.label.fi;
                              labelHi = highlight[this.LABEL_FI_TAG][0];
                              vocabulary = this._getVocabularyLabel(source, "fi");
                            } else if(matchedFields.includes(this.LABEL_EN_TAG)) {
                              label = source.label.en;
                              labelHi = highlight[this.LABEL_EN_TAG][0];
                              vocabulary = this._getVocabularyLabel(source, "en");
                            } else if(matchedFields.includes(this.LABEL_SV_TAG)) {
                              label = source.label.sv;
                              labelHi = highlight[this.LABEL_SV_TAG][0];
                              vocabulary = this._getVocabularyLabel(source, "sv");
                            } else {
                              if(this.ls.language === 'fi') {
                                if(source.label.fi) {
                                  label = source.label.fi;
                                } else if(source.label.en) {
                                  label = source.label.en;
                                } else if(source.label.sv) {
                                  label = source.label.sv;
                                }
                                vocabulary = this._getVocabularyLabel(source, "fi");
                              } else if(this.ls.language === 'en') {
                                if(source.label.en) {
                                  label = source.label.en;
                                } else if(source.label.fi) {
                                  label = source.label.fi;
                                } else if(source.label.sv) {
                                  label = source.label.sv;
                                }
                                vocabulary = this._getVocabularyLabel(source, "en");
                              }
                            }

                            if(this.ls.language === 'fi') {
                              if(source.definition.fi) {
                                definition = source.definition.fi;
                              } else if(source.definition.en) {
                                definition = source.definition.en;
                              } else if(source.definition.sv) {
                                definition = source.definition.sv;
                              }
                            } else if(this.ls.language === 'en') {
                              if(source.definition.en) {
                                definition = source.definition.en;
                              } else if(source.definition.fi) {
                                definition = source.definition.fi;
                              } else if(source.definition.sv) {
                                definition = source.definition.sv;
                              }
                            }

                            if(label) {
                              return {
                                graphId: source.vocabulary.id,
                                conceptId: source.id,
                                label: labelHi ? labelHi : label,
                                definition: definition,
                                vocabulary: vocabulary
                              }
                            }
                            return source;
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

  _getVocabularyLabel(source: any, lang: string): string {
    if(source.vocabulary && source.vocabulary.label) {
      if (lang === 'fi') {
        if (source.vocabulary.label.fi) {
          return source.vocabulary.label.fi;
        } else if (source.vocabulary.label.en) {
          return source.vocabulary.label.en;
        } else if (source.vocabulary.label.sv) {
          return source.vocabulary.label.sv;
        }
      } else if (lang === 'sv') {
        if (source.vocabulary.label.sv) {
          return source.vocabulary.label.sv;
        } else if (source.vocabulary.label.fi) {
          return source.vocabulary.label.fi;
        } else if (source.vocabulary.label.en) {
          return source.vocabulary.label.en;
        }
      } else if (lang === 'en') {
        if (source.vocabulary.label.en) {
          return source.vocabulary.label.en;
        } else if (source.vocabulary.label.fi) {
          return source.vocabulary.label.fi;
        } else if (source.vocabulary.label.sv) {
          return source.vocabulary.label.sv;
        }
      }
    }
    return "N/A";
  }

  _frontPageQuery(searchStr: string): any {
    if (searchStr) {
      return {
        bool: {
          should: [
            {
              multi_match: {
                query: searchStr,
                fields:[
                  this.LABEL_FI_TAG,
                  this.LABEL_FI_TAG + this.EXACT_TAG
                ],
                type: "most_fields",
                _name: this.LABEL_FI_TAG,
                operator: "or",
                boost: this.ls.language === "fi" ? 6 : 4
              }
            },
            {
              multi_match: {
                query: searchStr,
                fields:[
                  this.LABEL_SV_TAG,
                  this.LABEL_SV_TAG + this.EXACT_TAG
                ],
                type: "most_fields",
                _name: this.LABEL_SV_TAG,
                operator: "or",
                boost: 6
              }
            },
            {
              multi_match: {
                query: searchStr,
                fields:[
                  this.LABEL_EN_TAG,
                  this.LABEL_EN_TAG + this.EXACT_TAG
                ],
                type: "most_fields",
                _name: this.LABEL_EN_TAG,
                operator: "or",
                boost: this.ls.language === "en" ? 6 : 4
              }
            },
            {
              match: {
                [this.ALTLABEL_FI_TAG]: {
                  query: searchStr,
                  _name: this.ALTLABEL_FI_TAG,
                  operator: "or",
                  boost: this.ls.language === "fi" ? 2 : 1

                }
              }
            },
            {
              match: {
                [this.ALTLABEL_SV_TAG]: {
                  query: searchStr,
                  _name: this.ALTLABEL_SV_TAG,
                  operator: "or",
                  boost: 1
                }
              }
            },
            {
              match: {
                [this.ALTLABEL_EN_TAG]: {
                  query: searchStr,
                  _name: this.ALTLABEL_EN_TAG,
                  operator: "or",
                  boost: this.ls.language === "en" ? 2 : 1

                }
              }
            },
            {
              match: {
                [this.DEFINITION_FI_TAG]: {
                  query: searchStr,
                  _name: this.DEFINITION_FI_TAG,
                  operator: "or",
                  boost: 1
                }
              }
            },
            {
              match: {
                [this.DEFINITION_SV_TAG]: {
                  query: searchStr,
                  _name: this.DEFINITION_SV_TAG,
                  operator: "or",
                  boost: 1
                }
              }
            },
            {
              match: {
                [this.DEFINITION_EN_TAG]: {
                  query: searchStr,
                  _name: this.DEFINITION_EN_TAG,
                  operator: "or",
                  boost: 1
                }
              }
            }
          ]
        }
      }
    }
    return null;
  }
}
