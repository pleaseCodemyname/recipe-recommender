// src/schemas/ingredient.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ingredient extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  quantity: number;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
