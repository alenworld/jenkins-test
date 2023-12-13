import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const AuthWsUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient();

  return client.user;
});

export default AuthWsUser;
