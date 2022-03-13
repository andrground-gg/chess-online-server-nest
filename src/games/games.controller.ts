import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { Game } from "./schemas/game.schema";
import { GamesService } from "./games.service";
import { UpdateGameDto } from "./dto/update-game.dto";

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.createGame(createGameDto);
  }

  @Get()
  async getGames(@Query('username') username: string): Promise<Game[]> {
    let games = await this.gamesService.getGames();

    if (username) {
      games = games.filter(g => g.white.username === username || g.black.username === username);
    }

    return games;
  }

  @Get(':id')
  async getGameById(@Param('id') id: string): Promise<Game> {
    return this.gamesService.getGameById(id);
  }

  @Patch(':gameId')
  async updateGame(@Param('gameId') gameId: string, @Body() updateGameDto: UpdateGameDto): Promise<Game> {
    return this.gamesService.updateGame(gameId, updateGameDto);
  }
}