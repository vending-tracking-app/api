import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../auth/constants/user-role.constant';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  image?: string;
}
