import { Role } from 'yti-common-ui/services/user.service';

export interface UserRequest {
  organizationId: string;
  role: Role[];
}
