import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export interface IEnvValidationError {
  name: string;
  errors: string[];
}

export class EnvParsingException extends Error {
  constructor(errors: IEnvValidationError[]) {
    super(
      errors.map(
        (validationError) => `${validationError.name}: ${validationError.errors.join(';')}`,
      ).join('\n'),
    );

    this.validationErrors = errors;
  }

  validationErrors: IEnvValidationError[];
}

export default function transformEnvValidationErrors(errors: ValidationError[], prefix: string = ''): EnvParsingException {
  return new EnvParsingException(
    errors.map((err) => ({
      name: `${prefix}.${err.property}`,
      errors: Object.values(err.constraints ?? {}),
    })),
  );
}

export function transformValidationErrors(errors: ValidationError[], description?: string): BadRequestException {
  return new BadRequestException(
    errors.flatMap((err) => Object.values(err.constraints ?? {})),
    description,
  );
}
