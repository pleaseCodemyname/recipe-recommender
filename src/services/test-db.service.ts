import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ingredient } from '../schemas/ingredient.schema';

@Injectable()
export class TestDbService {
  constructor(@InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>) {}

  async testConnection(): Promise<string> {
    try {
      const count = await this.ingredientModel.countDocuments();
      return `DB 연결 성공! 총 ${count}개의 Ingredient 문서가 있습니다.`;
    } catch (error) {
      return `DB 연결 실패: ${error.message}`;
    }
  }
}
