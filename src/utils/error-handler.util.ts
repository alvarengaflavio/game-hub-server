import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

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

/*
  if (err.name === 'ValidationError') {
    throw new UnauthorizedException(err.message);
  }

  if (err.name === 'CastError') {
    throw new UnprocessableEntityException(err.message);
  }

  if (err.name === 'JsonWebTokenError') {
    throw new UnauthorizedException(err.message);
  }

  if (err.name === 'TokenExpiredError') {
    throw new UnauthorizedException(err.message);
  }

  if (err.name === 'AuthenticationError') {
    throw new UnauthorizedException(err.message);
  }

  if (err.name === 'ForbiddenError') {
    throw new ForbiddenException(err.message);
  }

  if (err.name === 'NotFoundError') {
    throw new NotFoundException(err.message);
  }

  if (err.name === 'ConflictError') {
    throw new ConflictException(err.message);
  }

  if (err.name === 'BadRequestError') {
    throw new BadRequestException(err.message);
  }

  if (err.name === 'InternalServerError') {
    throw new InternalServerErrorException(err.message);
  }

  throw new InternalServerErrorException(err.message);

*/
