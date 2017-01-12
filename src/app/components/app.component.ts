import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <navigation-bar></navigation-bar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.addLangs(['fi', 'en']);
    this.translate.setDefaultLang('fi');
    this.translate.use('fi');
  }
}
