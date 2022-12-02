import { PrismaClientValidationError } from '@prisma/client/runtime';

export function prismaExeptionFilter(err: any, message: string): void {
  if ('code' in err) {
    if (err.code === 'P2002') {
      if (err.meta?.target?.includes('email')) {
        err.name = 'ConflictError';
        err.message = 'Email já cadastrado';
      }

      if (err.meta?.target?.includes('cpf')) {
        err.name = 'ConflictError';
        err.message = 'CPF já cadastrado';
      }
    }

    if (err.code === 'P2025') {
      err.name = 'BadRequestError';
      err.message = [err.meta?.cause, message];
    }
  }

  if (err instanceof PrismaClientValidationError) {
    err.name = 'BadRequestError';
    err.message = message;
  }
}
