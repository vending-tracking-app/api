import { IsEmail, IsString } from 'class-validator';

export class EmailSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
