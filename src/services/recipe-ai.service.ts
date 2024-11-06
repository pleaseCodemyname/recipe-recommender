import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecipeAIService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct';
    this.apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
    console.log('Using API Key:', this.apiKey);
  }

  async getRecipe(ingredients: string[]): Promise<string> {
    const prompt = `Using the following ingredients, create two unique and creative recipes. Each recipe should include a dish name and detailed step-by-step cooking instructions. Make sure to clearly specify how each ingredient is used.\n\n
    Ingredients: ${ingredients.join(', ')}\n\n
    1. Dish Name: 
    - Step 1: 
    - Step 2: 
    - Step 3: 
    
    2. Dish Name: 
    - Step 1: 
    - Step 2: 
    - Step 3: `;
    
    let attempts = 5;

    while (attempts > 0) {
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            this.apiUrl,
            {
              inputs: prompt,
              parameters: {
                max_length: 2500,
                max_new_tokens: 1000,
                temperature: 0.7, // 창의적인 결과를 위한 온도 조절
                top_p: 0.9, // 상위 p 확률로 샘플링
                top_k: 50, // 상위 k개의 단어 중에서 선택
              },
            },
            {
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

        const generatedText = response.data[0]?.generated_text || '레시피를 생성하지 못했습니다.';

        // 프롬프트 부분을 제거하고 레시피 부분만 반환
        const recipeText = generatedText.replace(prompt, '').trim(); // 프롬프트를 제거하고 남은 텍스트 반환
        
        return recipeText;
      } catch (error) {
        if (error.response?.data?.error.includes('currently loading')) {
          console.log('모델이 로드 중입니다. 잠시 후 다시 시도합니다...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts--;
        } else {
          console.error('Hugging Face API 호출 오류:', error.response?.data || error.message);
          throw new Error('Hugging Face API 호출 중 오류가 발생했습니다.');
        }
      }
    }

    throw new Error('모델 로딩 시간 초과. 나중에 다시 시도해 주세요.');
  }
}
