import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from 'src/games/games.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({cors: true})
export class GameGateway {
  constructor(private readonly usersService: UsersService, private readonly gamesService: GamesService) {}

  @WebSocketServer()
  server;

  games: Map<string, { 
    whiteTime: number,
    blackTime: number,
    increment: number,
    interval: NodeJS.Timer,
    isWhiteTurn: boolean,
    moves: number,
    board: string[][], 
    whiteCastling: { WKSC: boolean, WQSC: boolean },
    blackCastling: { BKSC: boolean, BQSC: boolean },
    enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] },
    isCheck: boolean
   }> = new Map();

  @SubscribeMessage('offerDraw')
  async handleOfferDraw(@MessageBody() message: { id: string }): Promise<void> {
    this.server.in(message.id).emit('offerDraw');
  }

  @SubscribeMessage('madeMove')
  async handleMadeMove(@MessageBody() message: { id: string, board: string[][], whiteCastling: { WKSC: boolean, WQSC: boolean }, blackCastling: { BKSC: boolean, BQSC: boolean }, enPassant: { isAvailable: boolean, passingPawn: number[], captureSquare: number[] }, isCheck: boolean }) {
    if (this.games.get(message.id).isWhiteTurn)
      this.games.get(message.id).whiteTime = this.games.get(message.id).whiteTime + this.games.get(message.id).increment;
    else
      this.games.get(message.id).blackTime = this.games.get(message.id).blackTime + this.games.get(message.id).increment;

    this.games.get(message.id).isWhiteTurn = !this.games.get(message.id).isWhiteTurn;
    this.games.get(message.id).moves++;
    this.games.get(message.id).board = message.board;
    this.games.get(message.id).whiteCastling = message.whiteCastling;
    this.games.get(message.id).blackCastling = message.blackCastling;
    this.games.get(message.id).enPassant = message.enPassant;
    this.games.get(message.id).isCheck = message.isCheck;
    this.server.in(message.id).emit('madeMove', { 
      board: message.board, 
      isWhiteTurn: this.games.get(message.id).isWhiteTurn,
      moves: this.games.get(message.id).moves, 
      whiteCastling: this.games.get(message.id).whiteCastling,
      blackCastling: this.games.get(message.id).blackCastling,
      enPassant: this.games.get(message.id).enPassant,
      isCheck: this.games.get(message.id).isCheck
    });
  }

  @SubscribeMessage('getGameData')
  async handleGetData(@MessageBody() message: { id: string }, @ConnectedSocket() client: Socket) {
    client.emit('sendData', { 
      board: this.games.get(message.id).board, 
      isWhiteTurn: this.games.get(message.id).isWhiteTurn, 
      moves: this.games.get(message.id).moves,
      whiteCastling: this.games.get(message.id).whiteCastling, 
      blackCastling: this.games.get(message.id).blackCastling,
      enPassant: this.games.get(message.id).enPassant,
      isCheck: this.games.get(message.id).isCheck 
    });
  }

  @SubscribeMessage('startTimer')
  async handleStartTimer(@MessageBody() message: { id: string, time: number, increment: number, board: string[][], mode: string, whiteName: string, blackName: string, whiteElo: number, blackElo: number }) {
    if (this.games.has(message.id))
      return;

    let whiteTime = message.time;
    let blackTime = message.time;

    let interval: NodeJS.Timer = setInterval(() => {
      whiteTime = this.games.get(message.id).whiteTime;
      blackTime = this.games.get(message.id).blackTime;

      if (this.games.get(message.id).isWhiteTurn)
        whiteTime--;
      else
        blackTime--;
     
      this.games.get(message.id).whiteTime = whiteTime;
      this.games.get(message.id).blackTime = blackTime;
      this.server.in(message.id).emit('sendTime', { whiteTime, blackTime });

      if (whiteTime === 0 || blackTime === 0)
        this.handleEndGame({
          id: message.id, 
          mode: message.mode, 
          white: {
            username: message.whiteName, 
            score: whiteTime === 0 ? 0 : 1, 
            oldElo: message.whiteElo
          }, 
          black: {
            username: message.blackName,
            score: whiteTime === 0 ? 1 : 0,
            oldElo: message.blackElo
          },
          moves: this.games.get(message.id).moves
        });
    }, 1000);

    this.games.set(message.id, { 
      whiteTime,
      blackTime,
      increment: message.increment,
      interval, 
      isWhiteTurn: true, 
      moves: 0, 
      board: message.board, 
      whiteCastling: { WKSC: true, WQSC: true }, 
      blackCastling: { BKSC: true, BQSC: true },
      enPassant: { isAvailable: false, passingPawn: [], captureSquare: [] },
      isCheck: false
    });

    this.server.in(message.id).emit('sendTime', { whiteTime: message.time, blackTime: message.time });
  }

  @SubscribeMessage('endGame')
  async handleEndGame(@MessageBody() message: { id: string, mode: string, white: { username: string, score: number, oldElo: number }, black: { username: string, score: number, oldElo: number }, moves: number}): Promise<void> {
    if (this.games.has(message.id)) {
      clearInterval(this.games.get(message.id).interval);
      this.games.delete(message.id);
    }
    this.gamesService.updateGame(message.id, {
      isFinished: true,
      chat: [],
      moves: message.moves,
      white: {
        username: message.white.username,
        eloAtTheTime: message.white.oldElo,
        score: message.white.score
      },
      black: {
        username: message.black.username,
        eloAtTheTime: message.black.oldElo,
        score: message.black.score
      },
    });

    let expectedWhiteScore: number = 1 / (1 + Math.pow(10, (message.black.oldElo - message.white.oldElo) / 400));
    let newWhiteElo = Math.round(message.white.oldElo + 40 * ((message.white.score === message.black.score ? 0.5 : message.white.score) - expectedWhiteScore));

    let expectedBlackScore: number = 1 - expectedWhiteScore;
    let newBlackElo = Math.round(message.black.oldElo + 40 * ((message.white.score === message.black.score ? 0.5 : message.black.score) - expectedBlackScore));

    this.server.in(message.id).emit('endGame', { white: { score: message.white.score, newElo: newWhiteElo }, black: { score: message.black.score, newElo: newBlackElo } });

    const white = await this.usersService.getUserByUsername(message.white.username);
    let whiteStats: { 
      bullet: { totalGames: number, won: number, draw: number, lost: number }, 
      blitz: { totalGames: number, won: number, draw: number, lost: number }, 
      rapid: { totalGames: number, won: number, draw: number, lost: number },
    } = white.stats;

    whiteStats[message.mode].totalGames++;
    whiteStats[message.mode].elo = newWhiteElo;
    
    const black = await this.usersService.getUserByUsername(message.black.username);
    let blackStats: { 
      bullet: { totalGames: number, won: number, draw: number, lost: number }, 
      blitz: { totalGames: number, won: number, draw: number, lost: number }, 
      rapid: { totalGames: number, won: number, draw: number, lost: number },
    } = black.stats;
    
    blackStats[message.mode].totalGames++;
    blackStats[message.mode].elo = newBlackElo;

    if (message.white.score === message.black.score) {
      whiteStats[message.mode].draw++;
      blackStats[message.mode].draw++;
    }
    else if (message.white.score === 1) {
      whiteStats[message.mode].won++;
      blackStats[message.mode].lost++;
    }
    else if (message.black.score === 1) {
      whiteStats[message.mode].lost++;
      blackStats[message.mode].won++;
    }

    await this.usersService.updateUser(white._id, { stats: whiteStats });
    await this.usersService.updateUser(black._id, { stats: blackStats });
    this.server.socketsLeave(message.id);
  }
}