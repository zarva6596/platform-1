import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true })
  value: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    ref: 'users',
  })
  users: [];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
