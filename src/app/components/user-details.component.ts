import { Component, OnDestroy } from '@angular/core';
import { Role, UserService } from 'yti-common-ui/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TermedService } from 'app/services/termed.service';
import { OrganizationNode } from 'app/entities/node';
import { index } from 'yti-common-ui/utils/array';
import { LocationService } from 'app/services/location.service';
import { comparingLocalizable } from 'yti-common-ui/utils/comparator';
import { LanguageService } from 'app/services/language.service';
import { Options } from 'yti-common-ui/components/dropdown.component';
import { TranslateService } from 'ng2-translate';
import { combineSets, hasAny } from 'yti-common-ui/utils/set';
import { Observable } from 'rxjs/Observable';

interface UserOrganizationRoles {
  organization?: OrganizationNode;
  roles: Role[];
  requests: Role[];
}

@Component({
  selector: 'app-user-details',
  styleUrls: ['./user-details.component.scss'],
  template: `
    <div class="content-box" *ngIf="!loading">

      <div class="page-header">
        <h2 translate>User details</h2>
      </div>

      <div class="form-group">
        <label translate>Name</label>
        <p class="form-control-static">{{user.name}}</p>
      </div>

      <div class="form-group">
        <label translate>Email</label>
        <p class="form-control-static">{{user.email}}</p>
      </div>

      <div class="form-group">
        <label translate>Organizations and roles</label>
        <div class="form-control-static">
          <div *ngFor="let userOrganization of userOrganizations">
            <div *ngIf="userOrganization.organization">{{userOrganization.organization.label | translateValue:true}}</div>
            <div *ngIf="!userOrganization.organization" translate>Unknown organization</div>
            <ul>
              <li *ngFor="let role of userOrganization.roles">{{role | translate}}</li>
              <li *ngFor="let requestRole of userOrganization.requests">
                {{requestRole | translate}} (<span translate>Waiting for approval</span>)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="form-group">

        <label translate>Send access request</label>
        
        <div class="input-group">
          
          <app-dropdown [options]="organizationOptions"
                        id="selected_organization_dropdown"
                        [showNullOption]="false"
                        [placement]="'top-left'"
                        [(ngModel)]="selectedOrganization"></app-dropdown>

          <div class="input-group-btn">
            <button type="button"
                    id="send_request_button"
                    class="btn btn-action"
                    [disabled]="!selectedOrganization"
                    (click)="sendRequest()" translate>Send</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailsComponent implements OnDestroy  {

  private subscriptionToClean: Subscription[] = [];

  allOrganizations: OrganizationNode[];
  allOrganizationsById: Map<string, OrganizationNode>;
  selectedOrganization: OrganizationNode|null = null;
  requestsInOrganizations = new Map<string, Set<Role>>();

  constructor(private router: Router,
              private userService: UserService,
              private termedService: TermedService,
              private locationService: LocationService,
              private languageService: LanguageService,
              private translateService: TranslateService) {

    this.subscriptionToClean.push(this.userService.loggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        router.navigate(['/']);
      }
    }));

    userService.updateLoggedInUser();

    locationService.atUserDetails();

    this.subscriptionToClean.push(
      Observable.combineLatest(termedService.getOrganizationList(), languageService.language$)
        .subscribe(([organizationNodes]) => {

        organizationNodes.sort(comparingLocalizable<OrganizationNode>(languageService, org => org.label));
        this.allOrganizations = organizationNodes;
        this.allOrganizationsById = index(organizationNodes, org => org.id);
      })
    );

    this.refreshRequests();
  }

  ngOnDestroy() {
    this.subscriptionToClean.forEach(s => s.unsubscribe());
  }

  get user() {
    return this.userService.user;
  }

  get loading() {
    return !this.allOrganizations || !this.requestsInOrganizations;
  }

  get userOrganizations(): UserOrganizationRoles[] {

    const organizationIds = new Set<string>([
      ...Array.from(this.user.rolesInOrganizations.keys()),
      ...Array.from(this.requestsInOrganizations.keys())
    ]);

    const result = Array.from(organizationIds.values()).map(organizationId => {
      return {
        organization: this.allOrganizationsById.get(organizationId),
        roles: Array.from(this.user.getRoles(organizationId)),
        requests: Array.from(this.requestsInOrganizations.get(organizationId) || [])
      }
    });

    result.sort(comparingLocalizable<UserOrganizationRoles>(this.languageService, org => org.organization ? org.organization.label : {}));

    return result;
  }

  get organizationOptions(): Options<OrganizationNode> {

    const hasExistingRoleOrRequest = (org: OrganizationNode) => {

      const rolesOrRequests = combineSets([
        this.user.getRoles(org.id),
        this.requestsInOrganizations.get(org.id) || new Set<Role>()
      ]);

      return hasAny(rolesOrRequests, ['TERMINOLOGY_EDITOR', 'ADMIN']);
    };

    const requestableOrganizations = this.allOrganizations.filter(organization => !hasExistingRoleOrRequest(organization));

    return [null, ...requestableOrganizations].map(org => {
      return {
        value: org,
        name: () => org ? this.languageService.translate(org.label, true)
                        : this.translateService.instant('Choose organization')
      };
    })
  }

  sendRequest() {

    if (!this.selectedOrganization) {
      throw new Error('No organization selected for request');
    }

    this.termedService.sendRequest(this.selectedOrganization.id)
      .subscribe(() => this.refreshRequests());
  }

  refreshRequests() {

    this.selectedOrganization = null;

    this.termedService.getUserRequests().subscribe(userRequests => {

      this.requestsInOrganizations.clear();

      for (const userRequest of userRequests) {
        this.requestsInOrganizations.set(userRequest.organizationId, new Set<Role>(userRequest.role));
      }
    });
  }
}
