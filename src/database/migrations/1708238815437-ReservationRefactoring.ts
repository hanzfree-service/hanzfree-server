import { Logger } from '@nestjs/common';
import { generateBookingNumber } from 'src/common/utils';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBookingNumberToReservation1708238815437
  implements MigrationInterface
{
  name?: string;
  transaction?: boolean;

  private readonly logger = new Logger(
    'AddBookingNumberToReservation1708238815437',
  );

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Migration up');

    await queryRunner.addColumn(
      'reservation',
      new TableColumn({
        name: 'booking_number',
        type: 'varchar(255)',
      }),
    );

    // reservation ID 목록을 가져옵니다.
    const ids = await queryRunner.query('SELECT id FROM reservation');

    // 각 사용자 ID에 대해 유니크한 bookingNumber를 생성하고 저장합니다.
    for (const id of ids) {
      const bookingNumber = await generateUniqueBookingNumber();

      await queryRunner.query(
        `UPDATE reservation SET booking_number = ? WHERE id = ?`,
        [bookingNumber, id.id],
      );
    }

    async function generateUniqueBookingNumber() {
      let bookingNumber;

      do {
        bookingNumber = generateBookingNumber(); // 8자리 랜덤 문자열 생성 함수
      } while (await isBookingNumberExists(bookingNumber));

      return bookingNumber;
    }

    async function isBookingNumberExists(bookingNumber) {
      const result = await queryRunner.query(
        `SELECT COUNT(*) FROM reservation WHERE booking_number = ?`,
        [bookingNumber],
      );

      return result[0]['COUNT(*)'] > 0;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Migration down');
    await queryRunner.dropColumn('reservation', 'booking_number');
  }
}
