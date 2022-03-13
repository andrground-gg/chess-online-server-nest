export class UpdateUserDto {
  readonly stats: { 
    bullet: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    },
    blitz: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    },
    rapid: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    }
  }
}