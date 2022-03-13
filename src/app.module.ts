import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { ChatGateway } from './gateways/chat.gateway';
import { GameGateway } from './gateways/game.gateway';
import { SearchGateway } from './gateways/search.gateway';
import { UsersModule } from './users/users.module';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`), 
    AuthModule,
    UsersModule,
    GamesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'chess-site-frontend/dist')
    })
  ],
  controllers: [AppController],
  providers: [AppService, SearchGateway, ChatGateway, GameGateway],
})
export class AppModule {}
