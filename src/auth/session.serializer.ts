import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: User) => void): any {
    done(null, user.username);
  }
  async deserializeUser(username: string, done: (err: Error, user: User) => void): Promise<any> {
    const userDB = await this.usersService.getUserByUsername(username);
    done(null, userDB);
  }
}