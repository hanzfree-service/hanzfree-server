import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  //   @IsString()
  //   @ApiProperty({ description: '이메일' })
  //   readonly email: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly method: string;

  @IsString()
  readonly date: Date;

  @IsString()
  readonly quantity: number;

  @IsString()
  readonly hotelName: string;

  @IsString()
  readonly hotelAddress: string;

  @IsString()
  readonly hotelRepresentativeName: string;

  @IsString()
  readonly airportTerminal: string;

  @IsString()
  readonly arrivalTimeHour: string;

  @IsString()
  readonly arrivalTimeMin: string;

  @IsString()
  readonly flightNumber: string;

  @IsString()
  readonly dropOffTimeHour: string;

  @IsString()
  readonly dropOffTimeMin: string;

  @IsString()
  readonly contactId: string;

  @IsString()
  readonly country: string;

  @IsString()
  readonly dialCode: string;

  @IsString()
  readonly phoneNumber: string;

  @IsNumber()
  readonly price: number;
}
