import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/models/user/entities/user.entity';
import { Reservation } from 'src/models/reservation/entities/reservation.entity';
import { Good } from 'src/models/goods/entities/good.entity';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : '.development.env',
});

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  timezone: 'Z',
  logging: true,
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'migration_table',
  migrationsRun: false,
  entities: [User, Reservation, Good],
});
