import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as path from 'path';

// dotenv.config({
//   path: path.resolve(
//     process.env.NODE_ENV === 'dev'
//       ? '.dev.env'
//       : process.env.NODE_ENV === 'stage'
//         ? '.stage.env'
//         : '.local.env',
//   ),
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.hanzfree.co.kr',
      // 'https://hanzfree.co.kr',
    ],
    // origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });
  // app.enable('trust proxy'); // 서버가 프록시 뒤에 있음을 명시
  app.use(cookieParser());
  app.use(
    session({
      secret: 'my-secret', // 세션을 암호화하기 위한 암호기 설정
      resave: false, // 모든 request마다 기존에 있던 session에 아무런 변경 사항이 없을 시에도 그 session을 다시 저장하는 옵션
      // saveUnitialized: 초기화되지 않은 세션을 저장할지 여부를 나타낸다.
      saveUninitialized: false,
      // 세션 쿠키에 대한 설정을 나타낸다.
      cookie: {
        // maxAge: 60000, // 1 minute
        httpOnly: true,
        sameSite: 'none',
        domain: '.hanzfree.co.kr',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Simple example')
    .setDescription('The Simple API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();
