import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Game, GameSchema } from "./schemas/game.schema";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],  
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService]
})

export class GamesModule {}