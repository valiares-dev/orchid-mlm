import { IsEmail, IsNotEmpty, IsString, IsBoolean, Equals, MinLength, IsOptional } from 'class-validator';

export class RegisterDTO {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  referralCode!: string;

  @IsBoolean()
  @Equals(true, { message: 'You must accept the terms and policy' })
  termsAccepted!: boolean;

  @IsOptional()
  @IsString()
  phone?: string;
}

