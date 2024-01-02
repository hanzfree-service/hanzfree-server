import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialLoginInfoDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: '유저 이름' })
  readonly firstName: string;

  @IsString()
  @ApiProperty({ description: '유저 성' })
  readonly lastName: string;

  @IsString()
  @ApiProperty({ description: '소셜' })
  readonly socialProvider: string;

  @IsString()
  @ApiProperty({ description: '구글 profile id' })
  readonly externalId: string;

  @IsString()
  @ApiProperty({ description: 'access_token' })
  readonly accessToken: string;

  @IsString()
  @ApiProperty({ description: 'refresh_token' })
  readonly refreshToken: string;
}
