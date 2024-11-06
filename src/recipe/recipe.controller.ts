import { Controller, Post, Body } from '@nestjs/common';
import { RecipeAIService } from '../services/recipe-ai.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeAIService: RecipeAIService) {}

  @Post('recommend')
  async recommendRecipe(@Body('ingredients') ingredients: string[]) {
    const recipe = await this.recipeAIService.getRecipe(ingredients);
    return { recipe };
  }
}
