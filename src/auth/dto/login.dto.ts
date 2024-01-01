import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;
}
