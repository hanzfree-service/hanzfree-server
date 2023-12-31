import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: '유저 이름' })
  readonly username: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;
}
