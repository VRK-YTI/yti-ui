import { Injectable } from '@angular/core';
import { UserService, UUID } from './user.service';
import { VocabularyNode } from '../entities/node';

@Injectable()
export class AuthorizationManager {

  constructor(private userService: UserService) {
  }

  get user() {
    return this.userService.user;
  }

  canEdit(vocabulary: VocabularyNode): boolean {

    if (!this.user) {
      return false;
    }

    const organizationIds = vocabulary.publishers.map(org => org.id);

    return this.user.isInRole(['ADMIN', 'TERMINOLOGY_EDITOR'], organizationIds);
  }

  canAddCollection(vocabulary: VocabularyNode): boolean {
    return this.canEdit(vocabulary);
  }

  canAddConcept(vocabulary: VocabularyNode): boolean {
    return this.canEdit(vocabulary);
  }

  canAddVocabulary(): boolean {

    if (!this.user) {
      return false;
    }

    if (this.user.superuser) {
      return true;
    }

    return this.user.getOrganizations(['ADMIN', 'TERMINOLOGY_EDITOR']).size > 0;
  }

  canEditOrganizationsIds(): UUID[] {

    if (!this.user) {
      return [];
    }

    return Array.from(this.user.getOrganizations(['ADMIN', 'TERMINOLOGY_EDITOR']));
  }
}
