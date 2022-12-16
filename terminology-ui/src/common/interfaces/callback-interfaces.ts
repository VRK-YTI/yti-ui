import { User } from 'yti-common-ui/interfaces/user.interface';

export interface AuthenticationFunctions {
  signInFakeUser: () => Promise<User>;
}

export interface LoginModalFunctions {
  closeModal: () => void;
}
