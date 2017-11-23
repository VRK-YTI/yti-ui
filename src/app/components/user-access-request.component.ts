import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrganizationNode } from 'app/entities/node';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-access-request',
  styleUrls: ['./user-access-request.component.scss'],
  template: `
    <div class="row">

        <div class="col-md-4">

          <div class="form-group">
            <dl>
              <dt><label for="organizationsForRequest" translate>Send access request</label></dt>
              <dd>
                <select id="organizationsForRequest" class="form-control" [(ngModel)]="organization">
                  <option [ngValue]="null" translate>Choose organization</option>
                  <option *ngFor="let organizationById of organizations"
                          [ngValue]="organizationById">
                    {{organizationById.label | translateValue}}
                  </option>
                </select>
              </dd>
            </dl>
          </div>

        </div>

        <div class="col-md-8">
          <button type="button"
                  class="btn btn-default send-button"
                  *ngIf="organization"
                  (click)="sendRequest()" translate>Send</button>
        </div>

    </div>
  `
})
export class UserAccessRequestComponent {

  @Input() organizationsById: Map<string, OrganizationNode>;

  organization: OrganizationNode|null = null;

  constructor(private userService: UserService,
              private router: Router) {
  }

  get organizations() {

    if (!this.organizationsById) {
      return [];
    }

    return Array.from(this.organizationsById.entries()).map(([organizationId, organizationById]) => {
      return organizationById;
    });
  }

  sendRequest() {
    
    if (this.organization) {
      console.log(this.organization.label.fi);
    }

    this.router.navigate(['/userDetails']);
  }
}
