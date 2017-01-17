import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <navigation-bar></navigation-bar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
