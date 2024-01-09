import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '이메일', required: false })
  readonly email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '비밀번호', required: false })
  readonly password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'refresh token', required: false })
  readonly currentRefreshToken?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'refresh token exp', required: false })
  readonly currentRefreshTokenExp?: Date;
}
