import { IsString } from 'class-validator';

export class CreateGoodDto {
  @IsString()
  readonly good_name: string;

  @IsString()
  readonly price: string;
}
