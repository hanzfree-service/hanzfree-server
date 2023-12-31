import { SetMetadata } from '@nestjs/common';

export const CommonResponse = (message?: string) =>
  SetMetadata('response_message', message);
