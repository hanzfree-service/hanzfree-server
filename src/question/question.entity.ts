import { Category } from 'src/category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany((type) => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @ManyToOne((type) => Category, { cascade: true })
  @JoinColumn({ name: 'cat_id' })
  category: Category;
}
