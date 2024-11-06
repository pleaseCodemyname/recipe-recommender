import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigService 임포트
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeController } from './recipe/recipe.controller';
import { RecipeAIService } from './services/recipe-ai.service';
import { Ingredient, IngredientSchema } from './schemas/ingredient.schema';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { TestDbService } from './services/test-db.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/recipeDB'),
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        headers: {
          Authorization: `Bearer ${configService.get<string>('HUGGINGFACE_API_KEY')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, RecipeController],
  providers: [AppService, RecipeAIService, TestDbService],
})
export class AppModule {}
