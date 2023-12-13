import ValidationConstants from '@common/constants/validation-constants';
import { applyDecorators } from '@nestjs/common';
import { Length, Matches } from 'class-validator';

const IsPassword = () => {
  return applyDecorators(
    Length(8),
    Matches(ValidationConstants.password.upperCaseAlphabetPattern.source, '',
      { message: 'password must contain at least 1 alphabetic uppercase character' }),
    Matches(ValidationConstants.password.lowerCaseAlphabetPattern.source, '',
      { message: 'password must contain at least 1 alphabetic lowercase character' }),
    Matches(ValidationConstants.password.numberPattern.source, '', { message: 'password must contain at least 1 digit' }),
  );
};
export default IsPassword;
