import transformEnvValidationErrors from '@common/functions/validation.errors';
import {
  IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, validate,
} from 'class-validator';

export class ServerVariables {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  serverPort!: number;

  @IsString()
  @IsOptional()
  @Matches(/^https?:\/\/.*[^/]$/, { message: 'should start with "http[s]://" and not end with "/"' })
  serverHost!: string;

  @IsString()
  @IsOptional()
  @Matches(/^https?:\/\/.*[^/]$/, { message: 'should start with "http[s]://" and not end with "/"' })
  clientHost!: string;
}

const loadServerVariables = async () => {
  const obj = Object.assign(new ServerVariables(), {
    serverPort: Number.parseInt(process.env.SERVER_PORT || '3000', 10),
    serverHost: process.env.SERVER_HOST ?? 'http://localhost:3000',
    clientHost: process.env.CLIENT_HOST,
  });

  const errors = await validate(obj);

  if (errors.length > 0) throw transformEnvValidationErrors(errors);

  return obj;
};

export default loadServerVariables;
