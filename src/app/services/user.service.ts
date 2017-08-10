import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

export interface User {
  name: string;
  username: string;
  password: string;
}

const adminUser: User = {
  name: 'Admin',
  username: 'admin',
  password: 'admin'
};

@Injectable()
export class UserService {

  user: User|null = null;

  loggedIn$ = new BehaviorSubject(this.isLoggedIn());

  constructor() {
    if (!environment.production) {
      this.login(adminUser);
    }
  }

  isLoggedIn() {
    return this.user !== null;
  }

  login(user: User) {
    this.user = user;
  }

  logout() {
    this.user = null;
    this.updateLoggedIn();
  }

  private updateLoggedIn() {
    this.loggedIn$.next(this.isLoggedIn());
  }
}
