import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface User {
  name: string;
}

const adminUser: User = {
  name: 'Admin'
};

@Injectable()
export class UserService {

  user: User|null = adminUser;

  loggedIn$ = new BehaviorSubject(this.isLoggedIn());

  isLoggedIn() {
    return this.user !== null;
  }

  logInAsAdmin() {
    this.user = adminUser;
    this.updateLoggedIn();
  }

  logout() {
    this.user = null;
    this.updateLoggedIn();
  }

  private updateLoggedIn() {
    this.loggedIn$.next(this.isLoggedIn());
  }
}
