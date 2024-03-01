import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import cheerio from 'cheerio';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getHello() {
    async function getProfileImage(username) {
      try {
        const response = await axios.get(
          `https://www.instagram.com/${username}/`,
        );
        const $ = cheerio.load(response.data);
        const fullName = $('meta[property="og:title"]')
          .attr('content')
          .split('•')[0];
        const _username = fullName.split(' ')[0].trim();
        const userId = fullName.split(' ')[1].trim().slice(2).slice(0, -1);

        const profileImageUrl = $('meta[property="og:image"]').attr('content');
        return { name: _username || userId, profileImageUrl };
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

    // 사용 예시
    const username = 'doyeong0009'; // 원하는 사용자의 인스타그램 사용자 이름으로 대체
    getProfileImage(username)
      .then((profileInfo) => {
        if (profileInfo) {
          console.log('프로필 정보', profileInfo);
        } else {
          console.log('프로필 이미지를 가져올 수 없습니다.');
        }
      })
      .catch((error) => console.error('Error:', error));

    return 'Hello World!';
  }
}
