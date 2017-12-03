import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `

    <div class="container-fluid">

      <div class="row">
        <div class="col-12 pb-2">
          <a href="/"><h4 class="title">Sanastot</h4></a>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <p translate>This service is developed and maintained by Population Registry Center of Finland</p>
        </div>

        <div class="col-md-4">

          <ul class="link-list">
            <li>
              <a href="/tietoa-suomifi-verkkopalvelusta" translate>Information about the web service</a>
            </li>
            <li>
              <a href="/tietosuojaseloste" translate>Description of file</a>
            </li>
            <li>
              <a href="/ohjeet" translate>User support</a>
            </li>
            <li>
              <a href="/ohjeet" translate>Feedback</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4">
          <a href="/" translate>Sourcecode is licensed under EUPL-1.2 license.</a>
        </div>
      </div>

    </div>
  `
})
export class FooterComponent {
}
