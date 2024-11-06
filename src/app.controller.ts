import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { TestDbService } from './services/test-db.service';

@Controller()
export class AppController {
  constructor(private readonly testDbService: TestDbService) {}

  // 기본 페이지
  @Get()
  root(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  // DB 연결 테스트 API
  @Get('/test-db')
  async testDbConnection(): Promise<string> {
    return await this.testDbService.testConnection();
  }
}
