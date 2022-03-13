export class UpdateGameDto {
  readonly moves: number;

  readonly isFinished: boolean;

  readonly chat: Object[];

  readonly white: { username: string, eloAtTheTime: number, score: number };

  readonly black: { username: string, eloAtTheTime: number, score: number };
}

