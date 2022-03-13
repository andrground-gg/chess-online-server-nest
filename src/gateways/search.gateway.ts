import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from '../games/games.service';

@WebSocketGateway({cors: true})
export class SearchGateway {
  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer()
  server;

  socketsUsers: Map<string, { username: string, elo: number }> = new Map();

  @SubscribeMessage('startSearch')
  async handleStartSearch(@MessageBody() message: { mode: string, timeMode: string, username: string, elo: number }, @ConnectedSocket() client: Socket): Promise<void> {
    const roomName = `${message.mode}:${message.timeMode}`;
    
    for (var room of client.rooms)
      client.leave(room);

    client.join(roomName);

    this.socketsUsers.forEach((val: {username: string}, key: string) => {
      if (val.username === message.username) {
        this.socketsUsers.delete(key);
        return;
      }
    });

    this.socketsUsers.set(client.id, { username: message.username, elo: message.elo });

    let roomSet: Set<string> = this.server.sockets.adapter.rooms.get(roomName);

    if (this.server.sockets.adapter.rooms.get(roomName).size === 2) {
      const game = await this.gamesService.createGame({
        date: new Date(Date.now()),
        mode: message.mode,
        timeMode: message.timeMode,
        white: {
          username: this.socketsUsers.get(Array.from(roomSet)[0]).username,
          eloAtTheTime: this.socketsUsers.get(Array.from(roomSet)[0]).elo
        },
        black: {
          username: this.socketsUsers.get(Array.from(roomSet)[1]).username,
          eloAtTheTime: this.socketsUsers.get(Array.from(roomSet)[1]).elo
        }
      });

      this.server.in(roomName).emit('startGame', game._id);
      this.server.socketsLeave(roomName);
    }
  }
  @SubscribeMessage('cancelSearch')
  async handleCancelSearch(@MessageBody() message: { mode: string, timeMode: string, username: string }, @ConnectedSocket() client: Socket): Promise<void> {
    const roomName = `${message.mode}:${message.timeMode}`;

    client.leave(roomName);
  }
}