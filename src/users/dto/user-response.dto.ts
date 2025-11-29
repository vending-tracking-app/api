import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
}
