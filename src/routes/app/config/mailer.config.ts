import transformEnvValidationErrors from '@common/functions/validation.errors';
import {
  IsBoolean,
  IsDefined, IsEmail, IsNumber, IsString, validate,
} from 'class-validator';

class MailerVariables {
  @IsDefined()
  @IsString()
  host!: string;

  @IsDefined()
  @IsNumber()
  port!: number;

  @IsDefined()
  @IsString()
  username!: string;

  @IsDefined()
  @IsString()
  password!: string;

  @IsDefined()
  @IsEmail()
  fromEmail!: string;

  @IsDefined()
  @IsBoolean()
  sendEmails!: boolean;
}

const loadMailerVariables = async () => {
  const mailer = Object.assign(new MailerVariables(), {
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
    fromEmail: process.env.MAILER_FROM_EMAIL,
    sendEmails: process.env.SEND_EMAILS === 'true',
  });

  const errors = await validate(mailer);

  if (errors.length > 0) throw transformEnvValidationErrors(errors, 'mailer');

  return { mailer };
};

export default loadMailerVariables;
