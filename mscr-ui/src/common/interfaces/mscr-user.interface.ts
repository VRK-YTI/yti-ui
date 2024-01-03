import { User } from 'yti-common-ui/interfaces/user.interface';
import { Organization } from '@app/common/interfaces/organizations.interface';

export interface MscrUser extends User {
  organizations: Array<Organization>;
}
