import transformEnvValidationErrors from '@common/functions/validation.errors';
import {
  IsNotEmpty, validate,
} from 'class-validator';

export class AwsVariables {
  @IsNotEmpty()
  accessKey!: string;

  @IsNotEmpty()
  secretKey!: string;

  @IsNotEmpty()
  endpoint!: string;

  @IsNotEmpty()
  region!: string;

  @IsNotEmpty()
  filesBucket!: string;
}

const loadAWSVariables = async () => {
  const obj = Object.assign(new AwsVariables(), {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    filesBucket: process.env.AWS_FILES_BUCKET,
  });

  const errors = await validate(obj);

  if (errors.length > 0) throw transformEnvValidationErrors(errors, 'aws');

  return { aws: obj };
};

export default loadAWSVariables;
