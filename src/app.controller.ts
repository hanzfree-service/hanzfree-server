import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import cheerio from 'cheerio';
import needle from 'needle';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getHello() {
    async function getProfileImage(username) {
      try {
        const response = await axios.get(
          `https://www.instagram.com/${username}/`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            },
          },
        );

        // console.log('response', response);
        const $ = cheerio.load(response.data);

        // console.log('$', $);
        // const thirdImgTag = $('img').eq(2).attr('src');
        // console.log('thirdImgTag', thirdImgTag);

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
    const username = 'bramdmedia'; // 원하는 사용자의 인스타그램 사용자 이름으로 대체
    getProfileImage(username)
      .then((profileInfo) => {
        if (profileInfo) {
          console.log('프로필 정보', profileInfo);
        } else {
          console.log('프로필 이미지를 가져올 수 없습니다.');
        }
      })
      .catch((error) => console.error('Error:', error));

    // const results = [];
    // try {
    //   needle.get(
    //     encodeURI(`https://www.instagram.com/${username}/`),
    //     function (err, res) {
    //       if (err) throw err;
    //       const $ = cheerio.load(res.body);
    //       const title = $('meta[property="og:title"]').attr('content');
    //       results.push({
    //         title: title,
    //       });
    //       console.log('results11', results);
    //       // fs.writeFile('./data.json', JSON.stringify(results));
    //     },
    //   );
    // } catch (e) {
    //   console.log('error', e);
    // }

    return 'Hello World!';
  }
}
