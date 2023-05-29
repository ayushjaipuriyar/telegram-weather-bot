// src/user.model.ts

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  username: string;

  @Prop()
  type: string;

  @Prop({ default: false })
  subscribed: boolean;

  @Prop({ default: false })
  blocked: boolean;

  @Prop()
  location: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
