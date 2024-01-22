import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import * as nodemailer from 'nodemailer';

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

    await this.sendReservationConfirmationEmail(createReservationDto);

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

  async sendReservationConfirmationEmail(reservation) {
    try {
      // Nodemailer transporter 생성
      const transporter = nodemailer.createTransport({
        service: process.env.email_service,
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      const dateObject = new Date(reservation.date);
      const formattedDate = dateObject.toLocaleDateString('en-US', {
        dateStyle: 'short',
      });

      // 이메일 본문 작성
      const emailBody = `
        <div>
          <h1>Thank you for your reservation, ${reservation.firstName} ${
            reservation.lastName
          }!</h1>
          <br /> 
          <div style="padding: 20px; border: 2px solid blue; border-radius: 10px; max-width: 600px; ">
            <h2>Your reservation details:</h2>
            <ul style="margin-bottom: 10px;">
              <li style="margin-bottom: 10px; font-size: 16px;">Date: ${formattedDate}</li>
              ${
                reservation.method === 'airportToHotel'
                  ? `<li style="margin-bottom: 10px; font-size: 16px;">Method: Airport to Hotel</li><li style="margin-bottom: 10px; font-size: 16px;">Terminal: ${reservation.airportTerminal}</li><li style="margin-bottom: 10px; font-size: 16px;">Drop off luggage Time: ${reservation.dropOffTimeHour}:${reservation.dropOffTimeMin}</li>`
                  : reservation.method === 'hotelToAirport'
                    ? `<li style="margin-bottom: 10px; font-size: 16px;">Method: Hotel to Airport</li><li style="margin-bottom: 10px; font-size: 16px;">Terminal: ${reservation.airportTerminal}</li><li style="margin-bottom: 10px; font-size: 16px;">Pick up luggage Time: ${reservation.pickUpTimeHour}:${reservation.pickUpTimeMin}</li>`
                    : ''
              }
              <li style="margin-bottom: 10px; font-size: 16px;">Quantity: ${
                reservation.quantity
              }</li>
              <li style="margin-bottom: 10px; font-size: 16px;">Hotel Name: ${
                reservation.hotelName
              }</li><li style="margin-bottom: 10px; font-size: 16px;">Hotel Address: ${
                reservation.hotelAddress
              }</li><li style="margin-bottom: 10px; font-size: 16px;">Hotel representative name: ${
                reservation.hotelRepresentativeName
              }</li><li style="margin-bottom: 10px; font-size: 16px;">Contact id: ${
                reservation.contactId
              }</li><li style="margin-bottom: 10px; font-size: 16px;">Phone number: ${
                reservation.dialCode
              }-${reservation.phoneNumber}</li>
            </ul>
          </div>
      
          <br />
          <p>If you have any questions, feel free to contact us.</p>
        </div>
      `;

      // 이메일 전송
      await transporter.sendMail({
        from: process.env.user,
        to: reservation.email,
        subject: '[HanzFree] Reservation Confirmation',
        html: emailBody,
      });

      console.log('Reservation confirmation email sent successfully!');
    } catch (error) {
      console.error('Error sending reservation confirmation email:', error);
      // 여기서 오류 처리 또는 다른 조치를 취할 수 있습니다.
    }
  }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
