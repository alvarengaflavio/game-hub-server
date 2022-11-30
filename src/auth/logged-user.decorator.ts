import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // delete request.user.password; // Não é necessário deletar a senha, pois o usuário já foi deletado no auth.service.ts no método login (linha 28) e no jwt.strategy.ts no método validate (linha 29)

  return request.user;
});
