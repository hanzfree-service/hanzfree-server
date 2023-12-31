import { Controller, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './question.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  cascadeTest(): Promise<Question> {
    return this.questionService.cascadeTest();
  }
}
