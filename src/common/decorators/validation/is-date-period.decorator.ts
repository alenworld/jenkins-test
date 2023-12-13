import ValidationConstants from '@common/constants/validation-constants';
import { Matches, ValidationOptions } from 'class-validator';

const IsDatePeriod = (options: ValidationOptions) => Matches(
  ValidationConstants.filters.datePeriod, 'g', { message: '$property must be in format: date = "DD/MM/YYYY"; date-date | -date | date-', ...options },
);

export default IsDatePeriod;
