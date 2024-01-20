import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: number) {
    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      user: { id: userId },
    });

    const savedReservation = await this.reservationRepository.save(reservation);
    return savedReservation;
  }

  findAll() {
    return this.reservationRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
