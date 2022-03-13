import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { encodePassword } from "src/utils/bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = this.userModel.findOne({ username: username });
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().select({ username: 1, stats: 1 });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const password = encodePassword(createUserDto.password);

    const newUser = new this.userModel({
      ...createUserDto, 
      password,
      registrationDate: new Date(Date.now()),
      stats: {
        bullet: {
          totalGames: 0,
          won: 0,
          lost: 0,
          draw: 0,
          elo: 600
        },
        blitz: {
          totalGames: 0,
          won: 0,
          lost: 0,
          draw: 0,
          elo: 600
        },
        rapid: {
          totalGames: 0,
          won: 0,
          lost: 0,
          draw: 0,
          elo: 600
        }
      }
    });
    return newUser.save();
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto);
  } 
}