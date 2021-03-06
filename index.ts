import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { FooterComponent } from './components/footer.component';
import { BackButtonComponent } from './components/back-button.component';
import { AjaxLoadingIndicatorComponent } from './components/ajax-loading-indicator.component';
import { AjaxLoadingIndicatorSmallComponent } from './components/ajax-loading-indicator-small.component';
import { ErrorModalComponent, ErrorModalService } from './components/error-modal.component';
import { ConfirmationModalComponent, ConfirmationModalService } from './components/confirmation-modal.component';
import { LoginModalComponent, LoginModalService } from './components/login-modal.component';
import { MenuComponent } from './components/menu.component';
import { DropdownComponent } from './components/dropdown.component';
import { FilterDropdownComponent } from './components/filter-dropdown.component';
import { StatusDropdownComponent } from './components/status-dropdown.component';
import { UserService, AUTHENTICATED_USER_ENDPOINT } from './services/user.service';
import { TranslateValuePipe, LOCALIZER } from './pipes/translate-value.pipe';
import { PopoverCloseComponent } from './components/popover-close.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { AccordionChevronComponent } from './components/accordion-chevron.component';
import { KeysPipe } from './pipes/keys.pipe';
import { NotificationDirective, NotificationWindowComponent } from './components/notification.component';
import { RequiredSymbolComponent } from './components/required-symbol.component';
import { InformationSymbolComponent } from './components/information-symbol.component';
import { StatusComponent } from "./components/status.component";
import { IconComponent } from "./components/icon.component";
import { ClipboardComponent } from './components/clipboard';
import { ClipboardModule } from 'ngx-clipboard';
import { ExpandableTextComponent } from './components/expandable-text.component';
import { AlertModalComponent, AlertModalService } from './components/alert-modal.component';

declare var require: any;

export { AUTHENTICATED_USER_ENDPOINT };
export { LOCALIZER }
export const ietfLanguageTags: string[] = require('./assets/ietf-language-tags.json');

const components = [
  AccordionChevronComponent,
  AjaxLoadingIndicatorComponent,
  AjaxLoadingIndicatorSmallComponent,
  BackButtonComponent,
  BreadcrumbComponent,
  ConfirmationModalComponent,
  DropdownComponent,
  ErrorModalComponent,
  ExpandableTextComponent,
  FilterDropdownComponent,
  StatusDropdownComponent,
  FooterComponent,
  HighlightPipe,
  KeysPipe,
  LoginModalComponent,
  MenuComponent,
  PopoverCloseComponent,
  TranslateValuePipe,
  NotificationDirective,
  NotificationWindowComponent,
  RequiredSymbolComponent,
  InformationSymbolComponent,
  StatusComponent,
  IconComponent,
  ClipboardComponent,
  AlertModalComponent
];

@NgModule({
  declarations: [...components],
  exports: [...components],
  entryComponents: [ // needed for modal components
    ErrorModalComponent,
    ConfirmationModalComponent,
    LoginModalComponent,
    NotificationWindowComponent,
    AlertModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    RouterModule,
    ClipboardModule
  ],
  providers: [
    ErrorModalService,
    LoginModalService,
    ConfirmationModalService,
    AlertModalService,
    UserService
  ]
})
export class YtiCommonModule {
}
