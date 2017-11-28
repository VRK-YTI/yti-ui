import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

export type Role = 'ADMIN'
                 | 'DATA_MODEL_EDITOR'
                 | 'TERMINOLOGY_EDITOR'
                 | 'CODE_LIST_EDITOR';

export type UUID = string;

export class User {

  email: string;
  firstName: string;
  lastName: string;
  anonymous: boolean;
  superuser: boolean;
  rolesInOrganizations: Map<UUID, Set<Role>>;
  organizationsInRole: Map<Role, Set<UUID>>;

  constructor(json: any) {
    this.email = json.email;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.anonymous = json.anonymous;
    this.superuser = json.superuser;
    this.rolesInOrganizations = convertToMapSet<UUID, Role>(json.rolesInOrganizations);
    this.organizationsInRole = convertToMapSet<Role, UUID>(json.organizationsInRole);
  }

  get name() {
    return this.firstName + ' ' + this.lastName;
  }

  getRoles(organizationIds: UUID|UUID[]): Set<Role> {
    return combineResultSets<UUID, Role>(this.rolesInOrganizations, organizationIds);
  }

  getOrganizations(roles: Role|Role[]): Set<UUID> {
    return combineResultSets<Role, UUID>(this.organizationsInRole, roles);
  }

  isInRole(role: Role|Role[], organizationIds: UUID|UUID[]) {
    return hasAny(this.getRoles(organizationIds), role);
  }

  isInOrganization(organizationIds: UUID|UUID[], roles: Role|Role[]) {
    return hasAny(this.getOrganizations(roles), organizationIds);
  }
}

@Injectable()
export class UserService {

  user: User|null = null;
  loggedIn$ = new BehaviorSubject(false);

  constructor(http: Http) {

    http.get(`${environment.api_url}/authenticated-user`)
      .subscribe(response => {
        this.user = new User(response.json());
        this.updateLoggedIn();
      });
  }

  isLoggedIn() {
    return this.user !== null && !this.user.anonymous;
  }

  logout() {
    const currentUrl = window.location.href;
    window.location.href = `/Shibboleth.sso/Logout?return=${encodeURIComponent(currentUrl)}`;
  }

  private updateLoggedIn() {
    this.loggedIn$.next(this.isLoggedIn());
  }
}

function normalizeArray<T>(obj: T|T[]): T[] {
  return Array.isArray(obj) ? obj : [obj];
}

function hasAny<T>(set: Set<T>, values: T|T[]) {

  for (const value of normalizeArray(values)) {
    if (set.has(value)) {
      return true;
    }
  }

  return false;
}

function combineResultSets<K, V>(map: Map<K, Set<V>>, keys: K|K[]): Set<V> {

  const normalizedKeys = normalizeArray(keys);

  switch (normalizedKeys.length) {
    case 0:
      return new Set<V>();
    case 1:
      return map.get(normalizedKeys[0]) || new Set<V>();
    default:
      const result = new Set<V>();

      for (const key of normalizedKeys) {

        const values = map.get(key);

        if (values) {
          values.forEach(value => result.add(value));
        }
      }

      return result;
  }
}

function getOrCreateSet<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {

  const set = map.get(key);

  if (set) {
    return set;
  } else {
    const newSet = new Set<V>();
    map.set(key, newSet);
    return newSet;
  }
}

function convertToMapSet<K extends string, V extends string>(mapSetLike: { [key: string]: string[] }): Map<K, Set<V>> {

  const map = new Map<K, Set<V>>();

  for (const entry of Object.entries(mapSetLike)) {

    const key = entry[0] as K;
    const values = entry[1] as V[];
    const set = getOrCreateSet(map, key);

    for (const value of values) {
      set.add(value);
    }
  }

  return map;
}
