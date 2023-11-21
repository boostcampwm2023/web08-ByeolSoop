import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/users/users.entity";

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
