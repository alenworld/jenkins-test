import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ExceptionResponse } from '@interfaces/exception-response.interface';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import TooManyRequestsException from './exceptions/too-many-requests.exception';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();

    const postgressErrorCodes = {
      CONFLICT: '23505',
    };

    // handle postgres conflict error, parse the conflicting fileds and return them in the response
    if (exception.code === postgressErrorCodes.CONFLICT) {
      const fields = exception.detail.match(/Key \((.*?)\)=/)[1];

      exception = new ConflictException(`(${fields})`);
    }

    const exceptionResponse: null | ExceptionResponse = exception.getResponse
      ? (exception.getResponse() as ExceptionResponse)
      : null;
    const status: number = exception.getStatus ? exception.getStatus() : 500;
    const user = ctx.getRequest() && ctx.getRequest().user ? ctx.getRequest().user : undefined;
    const i18n = getI18nContextFromRequest(ctx.getRequest());

    const userLang = user ? user.lang : 'en';

    if (status >= 500) {
      Logger.error(exception);
    }

    if (!i18n.lang) {
      return res.status(status).json({
        message: exception.message,
        error: exceptionResponse,
      });
    }

    const paramPattern = /\d+|[(][^)]*[)]/;
    const translationParam = paramPattern.test(exception.message) ? exception.message.match(paramPattern)[0].replace(/[()]/g, '') : '';

    let arg: string = i18n.t(
      `be.MSG.${exception.message.replace(paramPattern, '').trim() || 'LITERAL'}`,
      { lang: userLang, args: { obj: translationParam } },
    );
    if (arg.includes('be.MSG.')) arg = '';

    const errorDescription = exception.response?.error ? i18n.t(exception.response.error, { lang: userLang }) : '';

    if (exception.response) exception.response.error = errorDescription;

    let translationKey: string = '';
    switch (exception.constructor) {
      case NotFoundException:
        translationKey = 'be.ERR.NOT_FOUND';
        break;
      case ForbiddenException:
        translationKey = 'be.ERR.FORBIDDEN';
        break;
      case BadRequestException:
        translationKey = 'be.ERR.BAD_REQUEST';
        break;
      case UnauthorizedException:
        translationKey = 'be.ERR.UNAUTHORIZED';
        break;
      case TooManyRequestsException:
        translationKey = 'be.ERR.TOO_MANY_REQUESTS';
        break;
      case ConflictException:
        translationKey = 'be.ERR.CONFLICT';
        break;
      default:
        break;
    }
    exception.message = i18n.t(translationKey || exception.message, { lang: userLang, args: { obj: arg || errorDescription } });

    const exceptionMessage: string | null = exception.message || null;
    return res.status(status).json({
      message: exceptionMessage,
      error: exceptionResponse,
    });
  }
}
