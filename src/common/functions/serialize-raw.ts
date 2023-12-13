import { Type } from '@nestjs/common';
import * as ClassTransformer from 'class-transformer';

function SerializeRaw<T extends object>(Class: Type<T>, object: unknown): T {
  return ClassTransformer.classToPlain(Object.assign(new Class(), object)) as T;
}

export default SerializeRaw;
