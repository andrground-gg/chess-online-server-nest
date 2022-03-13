import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  [x: string]: any;
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: Object })
  stats: {
    bullet: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    },
    blitz: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    },
    rapid: {
      totalGames: number,
      won: number,
      draw: number,
      lost: number
    }
  };

  @Prop({ type: Object })
  games: object;

  @Prop()
  registrationDate: Date
}


export const UserSchema = SchemaFactory.createForClass(User);