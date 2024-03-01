import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getHello() {
    const query = 'doyeong0009';
    console.log('query', query);
    try {
      const url = `https://www.instagram.com/web/search/topsearch/?context=user&count=0&query=${query}`;
      const response = await this.httpService.get(url).toPromise();
      console.log('response', response.data);
    } catch (e) {
      console.log('error', e);
    }

    return 'Hello World!';
  }
}
