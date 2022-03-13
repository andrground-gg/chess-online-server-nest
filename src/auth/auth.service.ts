import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { comparePasswords } from "src/utils/bcrypt";

@Injectable() 
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // retrieve user
    const user = await this.usersService.getUserByUsername(username);

    if (user && comparePasswords(password, user.password)) {    
      return user;
    }

    return null;
  }
}