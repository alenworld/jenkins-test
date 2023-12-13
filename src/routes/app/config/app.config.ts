import { EnvParsingException } from '@common/functions/validation.errors';
import loadJwtVariables from './jwt.config';
import loadServerVariables from './server.config';

const loadEnv = async () => {
  const results = await Promise.allSettled([
    loadServerVariables(),
    loadJwtVariables(),
  ]);

  const errors = results.filter((err): err is PromiseRejectedResult => err.status === 'rejected').flatMap((err) => err.reason.validationErrors);
  if (errors.length > 0) {
    throw new EnvParsingException(errors);
  }

  return Object.fromEntries(results.flatMap((res) => Object.entries((res as PromiseFulfilledResult<any>).value)));
};

export default loadEnv;
