import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly username: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}