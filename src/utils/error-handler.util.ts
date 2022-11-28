import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';

export function handleError(err: { name: string; message: string }): void {
  if (err.message.includes('\n')) {
    const errArray: string[] = err.message?.split('\n');
    err.message = errArray[errArray.length - 1];
  }

  switch (err.name) {
    case 'AuthenticationError':
      throw new UnauthorizedException(err.message);

    case 'BadRequestError':
      throw new BadRequestException(err.message);

    case 'CastError':
      throw new UnprocessableEntityException(err.message);

    case 'ConflictError':
      throw new ConflictException(err.message);

    case 'Forbidden':
      throw new ForbiddenException(err.message);

    case 'InternalServerError':
      throw new InternalServerErrorException(err.message);

    case 'JsonWebTokenError':
      throw new UnauthorizedException(err.message);

    case 'NotFoundError':
      throw new NotFoundException(err.message);

    case 'TokenExpiredError':
      throw new UnauthorizedException(err.message);

    case 'UnauthorizedErrorError':
      throw new UnauthorizedException(err.message);

    case 'UnprocessableEntityError':
      throw new UnprocessableEntityException(err.message);

    case 'ValidationError':
      throw new UnauthorizedException(err.message);

    default:
      throw new InternalServerErrorException(err.message);
  }
}

export function buildPrismaError(err: any, message: string): void {
  err.message = message;

  if ('code' in err) {
    if (err.code === 'P2002') {
      // err.name = 'BadRequestError';

      if (err.meta?.target?.includes('email')) {
        err.name = 'ConflictError';
        err.message = 'Email já cadastrado';
      }

      if (err.meta?.target?.includes('cpf')) {
        err.name = 'ConflictError';
        err.message = 'CPF já cadastrado';
      }
    }
  }

  if (err instanceof PrismaClientValidationError) {
    err.name = 'BadRequestError';
  }
}
