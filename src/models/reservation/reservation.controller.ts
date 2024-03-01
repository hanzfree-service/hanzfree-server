import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('reservation-controller')
@Controller('reservation')
// @UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto, req.user.id);
  }

  @Patch(':bookingNumber')
  update(
    @Param('bookingNumber') bookingNumber: string,
    @Body() updateReservationDto: any,
  ) {
    return this.reservationService.update(bookingNumber, updateReservationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count-by-method')
  async countReservationsByMethod(@Req() req) {
    const counts = await this.reservationService.countReservationsByMethod(
      req.user.id,
    );
    return counts;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reservationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('method') method?: string,
  ) {
    console.log('method in controller', method);
    return this.reservationService.findAll(startDate, endDate, method);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
