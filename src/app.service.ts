import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '이건 프론트 페이지를 수정하는 코드야';
  }
}
