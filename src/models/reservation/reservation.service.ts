import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import * as nodemailer from 'nodemailer';
// import { createTransport, SendMailOptions } from 'nodemailer';

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

    await this.sendReservationConfirmationEmail(createReservationDto.email);
    return savedReservation;
  }

  findAll() {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation | undefined> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async findAllByUserId(userId: number) {
    return this.reservationRepository.find({ where: { user: { id: userId } } });
  }

  async findAllByUserIdAndReservationId(userId: number, reservationId: number) {
    return this.reservationRepository.findOne({
      where: { user: { id: userId }, id: reservationId },
    });
  }

  async sendReservationConfirmationEmail(
    email: string,
    // reservation: CreateReservationDto,
  ) {
    // Nodemailer transporter 생성
    const transporter = nodemailer.createTransport({
      service: process.env.email_service,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    // 이메일 본문 작성
    const emailBody = `
      <h1>Thank you for your reservation!</h1>
     
      <p>If you have any questions, feel free to contact us.</p>
    `;

    // 이메일 전송
    await transporter.sendMail({
      from: process.env.user,
      to: email,
      subject: 'Reservation Confirmation',
      html: emailBody,
    });
  }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
