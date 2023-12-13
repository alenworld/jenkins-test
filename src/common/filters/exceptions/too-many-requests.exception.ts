import { HttpException } from '@nestjs/common';

export default class TooManyRequestsException extends HttpException {
  constructor(message?: string) {
    super(
      {
        message: message ?? 'Retry later',
        error: 'TooManyRequestsException',
        statusCode: 429,
      },
      429,
    );
  }
}
