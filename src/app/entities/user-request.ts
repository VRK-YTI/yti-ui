import { Role } from 'app/services/user.service';

export interface UserRequest {
  organizationId: string;
  role: Role[];
}
