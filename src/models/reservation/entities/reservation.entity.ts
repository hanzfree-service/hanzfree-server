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

  @Column({ name: 'hotel_representative_name' })
  hotelRepresentativeName: string;

  @Column({ name: 'airport_terminal' })
  airportTerminal: string;

  @Column({ name: 'arrival_time_hour' })
  arrivalTimeHour: string;

  @Column({ name: 'arrival_time_minute' })
  arrivalTimeMin: string;

  @Column({ name: 'flight_number' })
  flightNumber: string;

  @Column({ name: 'drop_off_time_hour' })
  dropOffTimeHour: string;

  @Column({ name: 'drop_off_time_minute' })
  dropOffTimeMin: string;

  @Column({ name: 'departure_time_hour' })
  departureTimeHour: string;

  @Column({ name: 'departure_time_minute' })
  departureTimeMin: string;

  @Column({ name: 'pick_up_time_hour' })
  pickUpTimeHour: string;

  @Column({ name: 'pick_up_time_minute' })
  pickUpTimeMin: string;

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
