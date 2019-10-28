import { Component, OnDestroy } from '@angular/core';
import { Role, UserService } from 'yti-common-ui/services/user.service';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { index } from 'yti-common-ui/utils/array';
import { OrganizationNode } from '../../entities/node';
import { TermedService } from '../../services/termed.service';
import { comparingLocalizable } from '../../utils/comparator';
import { combineSets, hasAny } from 'yti-common-ui/utils/set';
import { labelNameToResourceIdIdentifier } from 'yti-common-ui/utils/resource';
import { LocationService } from '../../services/location.service';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Options } from 'yti-common-ui/components/dropdown.component';

interface UserOrganizationRoles {
  organization?: OrganizationNode;
  roles: Role[];
  requests: Role[];
}

@Component({
  selector: 'app-user-details-information',
  templateUrl: './user-details-information.component.html',
})
export class UserDetailsInformationComponent implements OnDestroy {


  private subscriptionToClean: Subscription[] = [];

  allOrganizations: OrganizationNode[];
  allOrganizationsById: Map<string, OrganizationNode>;
  selectedOrganization: OrganizationNode | null = null;
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
      combineLatest(termedService.getOrganizationList(), languageService.language$)
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
                        : this.translateService.instant('Choose organization'),
        idIdentifier: () => org ? labelNameToResourceIdIdentifier(this.languageService.translate(org.label, true)) : 'all_selected'
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
