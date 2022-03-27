import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(2, 15)
  readonly username: string;

  @IsNotEmpty()
  @Length(6, 30)
  readonly password: string;
}