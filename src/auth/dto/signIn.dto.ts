import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @IsString()
  password: string;
}