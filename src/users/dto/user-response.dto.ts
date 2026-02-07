import { UserRole } from '../../auth/constants/user-role.constant';

export class UserResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  image: string | null;
}
