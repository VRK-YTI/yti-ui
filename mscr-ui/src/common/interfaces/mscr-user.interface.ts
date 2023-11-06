import {User} from 'yti-common-ui/interfaces/user.interface';

export interface MscrUser extends User {
  organizations: Array<{ [key: string]: string }>;
}
