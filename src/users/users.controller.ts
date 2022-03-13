import { Body, Controller, Get, NotAcceptableException, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    let users: User[] = await this.usersService.getUsers();

    if (users.find(u => u.email === createUserDto.email)) throw new NotAcceptableException("Email already exists");
    if (users.find(u => u.username === createUserDto.username)) throw new NotAcceptableException("Username already in use");
      
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':userId')
  @UsePipes(ValidationPipe)
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto)
  }
}