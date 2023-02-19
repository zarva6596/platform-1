import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({
    type: Number,
    min: 1,
    max: 100,
    validate: { validator: (v) => v % 2 === 0 },
  })
  age: number;

  @Prop({ default: () => new Date().toString() })
  createAt: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    ref: 'Role',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
