import { User } from './user.interface';

export interface AuthenticationFunctions {
  signInFakeUser: () => Promise<User>;
}

export interface LoginModalFunctions {
  closeModal: () => void;
}
