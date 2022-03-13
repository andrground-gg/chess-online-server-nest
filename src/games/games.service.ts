import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Game, GameDocument } from "./schemas/game.schema";
import { CreateGameDto } from "./dto/create-game.dto";
import { UsersService } from "src/users/users.service";
import { UpdateGameDto } from "./dto/update-game.dto";

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>,private readonly usersService: UsersService) {}

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    // let game: { date: Date, moves: number, mode: string, white: {username: string, eloAtTheTime: number, score: number}, black: {username: string, eloAtTheTime: number, score: number}, isFinished: boolean} = { date: undefined, moves: undefined, mode: undefined, white: {username: undefined, eloAtTheTime: undefined, score: undefined}, black: {username: undefined, eloAtTheTime: undefined, score: undefined}, isFinished: undefined};
    // let modes = ['blitz', 'rapid', 'bullet'];

    // let users = await this.usersService.getUsers();

    // game.mode = modes[Math.floor(Math.random()*modes.length)];
    // game.date = new Date(new Date('2015-01-01').getTime() + Math.random() * (new Date(Date.now()).getTime() - new Date('2015-01-01').getTime()));
    // game.white.eloAtTheTime = Math.ceil(Math.random() * (2200 - 600) + 600);
    // game.black.eloAtTheTime = Math.ceil(game.white.eloAtTheTime + (Math.random() * (50 + 50) - 50));
    // game.white.username = users[Math.floor(Math.random()*users.length)].username;
    // game.black.username = users.filter(u => u.username !== game.white.username)[Math.floor(Math.random()*users.length)].username;
    // game.white.score = Math.round(Math.random());
    // game.black.score = game.white.score === 0 ? 1 : Math.round(Math.random());
    
    // game.isFinished = true;
    // game.moves = Math.ceil(Math.random() * (80 - 15) + 15);
    const newGame = new this.gameModel({
      ...createGameDto,
      isFinished: false,
      moves: 0
    });
    return newGame.save();
  }

  async getGames(): Promise<Game[]> {
    return this.gameModel.find();
  }

  async getGameById(id: string): Promise<Game> {
    return this.gameModel.findById(id);
  }

  async updateGame(gameId: string, updateGameDto: UpdateGameDto): Promise<Game> {
    return this.gameModel.findByIdAndUpdate(gameId, updateGameDto);
  } 
}