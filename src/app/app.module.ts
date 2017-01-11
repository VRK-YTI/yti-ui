import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './components/app.component';
import { TermedService } from './services/termed.service';
import { NavigationBarComponent } from './components/navigation-bar.component';
import { TermedHttp } from './services/termed-http.service';
import { VocabulariesComponent } from './components/vocabularies.component';

const appRoutes: Routes = [
  { path: '**', component: VocabulariesComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    VocabulariesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [TermedHttp, TermedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
