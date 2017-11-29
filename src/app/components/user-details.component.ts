import { Component, OnDestroy } from '@angular/core';
import { UserService, Role } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TermedService } from 'app/services/termed.service';
import { OrganizationNode } from 'app/entities/node';
import { index } from 'app/utils/array';
import { LocationService } from 'app/services/location.service';

interface UserOrganizationRoles {
  organization: OrganizationNode|undefined;
  roles: Role[];
  requests: Role[];
}

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
                    <li *ngFor="let requestRole of userOrganization.requests">
                      {{requestRole | translate}} (<span translate>Waiting for approval</span>)
                    </li>
                  </ul>
                </div>
              </div>
            </dd>
          </dl>
        </div>

      </div>

      <div class="row">
      
        <div class="col-md-4">

          <div class="form-group">
            <dl>
              <dt><label for="organizations" translate>Send access request</label></dt>
              <dd>
                <select id="organizations" class="form-control" [(ngModel)]="selectedOrganization">
                  <option [ngValue]="null" translate>Choose organization</option>
                  <option *ngFor="let organizationById of organizationsForRequest"
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
                  *ngIf="selectedOrganization"
                  (click)="sendRequest()" translate>Send</button>
        </div>
      </div>      
    </div>
  `
})
export class UserDetailsComponent implements OnDestroy  {

  private loggedInSubscription: Subscription;

  organizationsById: Map<string, OrganizationNode>;
  selectedOrganization: OrganizationNode|null = null;
  requestsInOrganizations: Map<string, Role[]>;

  constructor(private router: Router,
              private userService: UserService,
              private termedService: TermedService,
              private locationService: LocationService) {

    this.loggedInSubscription = this.userService.loggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        router.navigate(['/']);
      }
    });

    locationService.atUserDetails();

    termedService.getOrganizationList().subscribe(organizationNodes => {
      this.organizationsById = index(organizationNodes, org => org.id);  
    });

    this.getUserRequests();
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

  get userOrganizations(): UserOrganizationRoles[] {
    
    if (!this.organizationsById || !this.userService.user || !this.requestsInOrganizations) {
      return [];
    }
  
    const rolesInOrganizations = this.userService.user!.rolesInOrganizations;
  
    const organizationIds = new Set<string>([
      ...Array.from(rolesInOrganizations.keys()),
      ...Array.from(this.requestsInOrganizations.keys())
    ]);
  
    return Array.from(organizationIds.values()).map(organizationId => {
      return {
        organization: this.organizationsById.get(organizationId),
        roles: Array.from(rolesInOrganizations.get(organizationId) || []),
        requests: this.requestsInOrganizations.get(organizationId) || []
      }
    });
  }

  get organizationsForRequest() {

    if (!this.organizationsById) {
      return [];
    }

    const allOrganizations = Array.from(this.organizationsById.entries()).map(([organizationId, organizationById]) => {
      return organizationById;
    });

    const userOrganizations = this.userOrganizations.filter(userOrganization =>
      userOrganization.roles.includes('TERMINOLOGY_EDITOR') || userOrganization.requests.includes('TERMINOLOGY_EDITOR'))
        .map(userOrganization =>
          userOrganization.organization ? userOrganization.organization : undefined);

    return allOrganizations.filter(organization => !userOrganizations.includes(organization));
  }

  sendRequest() {

    this.termedService.sendRequest(this.selectedOrganization!.id)
      .subscribe({
        next: () => {
          this.selectedOrganization = null;
          this.getUserRequests();
        }
      });
  }

  getUserRequests() {
    
    this.termedService.getUserRequests().subscribe(userRequests => {

      this.requestsInOrganizations = new Map<string, Role[]>();
      
      for (const userRequest of userRequests) {
        this.requestsInOrganizations.set(userRequest.organizationId, userRequest.role);
      }        
    });
  }  
}
