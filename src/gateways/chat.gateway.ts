import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from '../games/games.service';

@WebSocketGateway({cors: true})
export class ChatGateway {
  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('joinChat')
  async handleJoinChat(@MessageBody() message: { id: string }, @ConnectedSocket() client: Socket): Promise<void> {
    client.join(message.id);
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(@MessageBody() message: { id: string }, @ConnectedSocket() client: Socket): Promise<void> {
    client.leave(message.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() message: { id: string, username: string, content: string }): Promise<void> {
    const utcString = new Date(Date.now()).toUTCString();
    this.server.in(message.id).emit('sendMessage', { username: message.username, content: message.content, time: utcString });

    const game = await this.gamesService.getGameById(message.id);

    let newChat = [];
    if (game.chat)
      newChat = [...game.chat];
      
    newChat.push({ username: message.username, content: message.content, time: utcString });
    this.gamesService.updateGame(message.id, {
      chat: newChat,
      moves: game.moves,
      isFinished: game.isFinished,
      black: game.black,
      white: game.white,
    });
  }
}