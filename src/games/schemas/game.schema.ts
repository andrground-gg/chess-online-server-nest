import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  [x: string]: any;
  @Prop({ type: Date })
  date: Date;

  @Prop()
  moves: number;

  @Prop()
  mode: string;

  @Prop()
  timeMode: string;

  @Prop({ type: Object })
  white: { username: string, eloAtTheTime: number, score: number };

  @Prop({ type: Object })
  black: { username: string, eloAtTheTime: number, score: number };

  @Prop()
  isFinished: boolean

  @Prop({ type: [] })
  chat: Object[]
}


export const GameSchema = SchemaFactory.createForClass(Game);