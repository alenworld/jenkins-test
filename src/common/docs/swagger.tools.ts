import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, getSchemaPath,
} from '@nestjs/swagger';

const ApiResponses = () => {
  const decorators = [
    ApiBadRequestResponse({
      description: '400. ValidationException',
    }),
    ApiInternalServerErrorResponse({
      description: '500. Internal Server Error',
    }),
    ApiNotFoundResponse({
      description: '404. Not found.',
    }),
    ApiUnauthorizedResponse({
      description: '401. Token expired',
    }),
  ];
  return applyDecorators(...decorators);
};

export default ApiResponses;

export const ApiSchema = (dto: string | Function) => ({
  type: 'object',
  properties: {
    data: {
      $ref: getSchemaPath(dto),
    },
  },
});

export const ApiArraySchema = (itemDto: string | Function) => ({
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: getSchemaPath(itemDto),
      },
    },
  },
});
