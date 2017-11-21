import { Component, OnDestroy } from '@angular/core';
import { UserService, Role } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TermedService } from 'app/services/termed.service';
import { OrganizationNode } from 'app/entities/node';
import { index } from 'app/utils/array';

@Component({
  selector: 'app-user-details',
  styleUrls: ['./user-details.component.scss'],
  template: `
      <div class="container-fluid" *ngIf="isLoggedIn">
        <div class="row">
          <div class="col-md-12">
            <div class="page-header">
              <h2 translate>User details</h2>
            </div>
          </div>
        </div>

        <div class="row">

          <div class="col-md-12">
            <dl>
              <dt><label translate>Name</label></dt>
              <dd>
                <div class="form-group">
                  {{name}}
                </div>
              </dd>
            </dl>
          </div>

          <div class="col-md-12">
            <dl>
              <dt><label translate>Email</label></dt>
              <dd>
                <div class="form-group">
                  {{email}}
                </div>
              </dd>
            </dl>
          </div>

          <div class="col-md-12">
            <dl>
              <dt><label translate>Organizations and roles</label></dt>
              <dd>
                <div class="form-group" *ngIf="userOrganizations">
                  <div *ngFor="let userOrganization of userOrganizations">
                    <div *ngIf="userOrganization.organization">{{userOrganization.organization.label | translateValue:false}}</div>
                    <div *ngIf="!userOrganization.organization" translate>Unknown organization</div>
                    <ul>
                      <li *ngFor="let role of userOrganization.roles">{{role | translate}}</li>
                    </ul>
                  </div>
                </div>
              </dd>
            </dl>
          </div>

        </div>
        
      </div>
  `
})
export class UserDetailsComponent implements OnDestroy  {

  private loggedInSubscription: Subscription;
  private organizationsById: Map<string, OrganizationNode>;

  constructor(private router: Router,
              private userService: UserService,
              private termedService: TermedService) {

    this.loggedInSubscription = this.userService.loggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        router.navigate(['/']);
      }
    });

    termedService.getOrganizationList().subscribe(organizationNodes => {
      this.organizationsById = index(organizationNodes, org => org.id);  
    });
    
  }
  
  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
  
  get name() {
    return this.userService.user ? this.userService.user.name : null;
  }

  get email() {
    return this.userService.user ? this.userService.user.email : null;
  }

  get userOrganizations(): { organization: OrganizationNode|undefined, roles: Role[] }[] {
  
    if (!this.organizationsById || !this.userService.user) {
      return [];
    }
    
    return Array.from(this.userService.user!.rolesInOrganizations.entries()).map(([organizationId, roles]) => {
      return {
        organization: this.organizationsById.get(organizationId),
        roles: Array.from(roles)
      }
    });
  }
}
