import { Question } from 'src/question/question.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @ManyToMany((type) => Question, (question) => question.categories)
  questions: Question[];
}
