import { FindConditions } from 'typeorm';
import { IPagination } from './pagination.interface';

export interface IFindOptions<T> {
  pagination?: IPagination;
  criteria: FindConditions<T>;
}
