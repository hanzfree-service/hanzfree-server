import { User } from 'src/models/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  method: string;

  @Column()
  date: Date;

  @Column()
  quantity: number;

  @Column({ name: 'hotel_name' })
  hotelName: string;

  @Column({ name: 'hotel_address' })
  hotelAddress: string;

  @Column({ name: 'hotel_representative_name', nullable: true })
  hotelRepresentativeName: string;

  @Column({ name: 'airport_terminal', nullable: true })
  airportTerminal: string;

  @Column({ name: 'arrival_time_hour', nullable: true })
  arrivalTimeHour: string;

  @Column({ name: 'arrival_time_minute', nullable: true })
  arrivalTimeMin: string;

  @Column({ name: 'flight_number', nullable: true })
  flightNumber: string;

  @Column({ name: 'drop_off_time_hour', nullable: true })
  dropOffTimeHour: string;

  @Column({ name: 'drop_off_time_minute', nullable: true })
  dropOffTimeMin: string;

  @Column({ name: 'departure_time_hour', nullable: true })
  departureTimeHour: string;

  @Column({ name: 'departure_time_minute', nullable: true })
  departureTimeMin: string;

  @Column({ name: 'pick_up_time_hour', nullable: true })
  pickUpTimeHour: string;

  @Column({ name: 'pick_up_time_minute', nullable: true })
  pickUpTimeMin: string;

  @Column({ name: 'arrival_hotel_name', nullable: true })
  arrivalHotelName: string;

  @Column({ name: 'arrival_hotel_address', nullable: true })
  arrivalHotelAddress: string;

  @Column({ name: 'contact_id' })
  contactId: string;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'dial_code' })
  dialCode: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  price: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date = new Date();

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}
