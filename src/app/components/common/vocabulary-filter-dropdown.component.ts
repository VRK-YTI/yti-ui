import { Component, Input, OnInit } from '@angular/core';
import { VocabularyNode } from 'app/entities/node';
import { FilterOptions } from 'yti-common-ui/components/filter-dropdown.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { comparingLocalizable } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vocabulary-filter-dropdown',
  template: `
    <app-filter-dropdown class="float-left"
                         id="vocabulary_filter_dropdown"
                         [options]="vocabularyOptions"
                         [filterSubject]="filterSubject"></app-filter-dropdown>
  `
})
export class VocabularyFilterDropdownComponent implements OnInit {

  @Input() filterSubject: BehaviorSubject<VocabularyNode|null>;
  @Input() vocabularies: Observable<VocabularyNode[]>;

  vocabularyOptions: FilterOptions<VocabularyNode>;

  constructor(private languageService: LanguageService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.vocabularies.subscribe(vocabs => {

      vocabs.sort(comparingLocalizable<VocabularyNode>(this.languageService, org => org.label));

      this.vocabularyOptions = [{
          value: null,
          name: () => this.translateService.instant('All vocabularies'),
          idIdentifier: () => 'all_selected'
        },
        ...vocabs.map(voc => ({ 
          value: voc,
          name: () => this.languageService.translate(voc.label, true),
          idIdentifier: () => voc.idIdentifier
        }))
      ];
    });
  }
}
