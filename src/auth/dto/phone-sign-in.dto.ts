import { IsString } from 'class-validator';

export class PhoneSignInDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;
}
