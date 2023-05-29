import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client).set(
  'collection',
  'client',
);
