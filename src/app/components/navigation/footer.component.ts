import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="panel-footer">

      <span>{{'Give feedback:' | translate}} <a href="mailto:iow@postit.csc.fi" translate>CSC - IT Center for Science Ltd</a></span>
    
      <span class="pull-right">
        <span translate>Source code</span>:
        <a href="https://github.com/CSC-IT-Center-for-Science/iow-termed-ui" target="_blank" translate>Frontend</a>,
        <a href="https://github.com/THLfi/termed-api" translate target="_blank">Backend</a>,
        <span translate>licensed under the</span>
        <a href="https://github.com/THLfi/termed-api/blob/master/LICENSE.txt" target="_blank">European Union Public Licence</a>
      </span>
    </div>
  `
})
export class FooterComponent {
}
