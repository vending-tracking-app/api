import { UserRole } from '../../auth/constants/user-role.constant';

export class UserResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
}
