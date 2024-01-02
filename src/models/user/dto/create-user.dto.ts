import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;

  @IsString()
  @ApiProperty({ description: '유저 이름' })
  readonly firstName: string;

  @IsString()
  @ApiProperty({ description: '유저 성' })
  readonly lastName: string;

  @IsString()
  @ApiProperty({ description: 'role' })
  readonly role: string;
}
