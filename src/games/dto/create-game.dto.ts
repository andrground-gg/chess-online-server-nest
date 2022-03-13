import { IsNotEmpty } from "class-validator";

export class CreateGameDto {
  @IsNotEmpty()
  readonly date: Date;

  @IsNotEmpty()
  readonly mode: string;

  @IsNotEmpty()
  readonly timeMode: string;

  @IsNotEmpty()
  readonly white: { username: string, eloAtTheTime: number };

  @IsNotEmpty()
  readonly black: { username: string, eloAtTheTime: number };
}