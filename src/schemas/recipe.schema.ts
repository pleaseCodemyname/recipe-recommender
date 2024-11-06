// src/schemas/recipe.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recipe extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String] })
  ingredients: string[];

  @Prop()
  instructions: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
