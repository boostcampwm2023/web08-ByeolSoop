// import {
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { DiariesRepository } from "src/diaries/diaries.repository";

// @Injectable()
// export class IdGuard extends AuthGuard("jwt") {
//   constructor(private readonly diariesRepository: DiariesRepository) {
//     super();
//   }

//   async handleRequest(err, user, info, context: ExecutionContext) {
//     if (err || !user) {
//       throw err || new UnauthorizedException();
//     }

//     const request = context.switchToHttp().getRequest();
//     const requestDiary = await this.diariesRepository.getDiaryByUuid(
//       request.params.uuid,
//     );
//     const requestUserId = requestDiary.user.userId;

//     if (user.userId === requestUserId) {
//       return user;
//     } else {
//       throw new UnauthorizedException();
//     }
//   }
// }

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DiariesRepository } from "src/diaries/diaries.repository";

@Injectable()
export class IdGuard extends AuthGuard("jwt") {
  constructor(private readonly diariesRepository: DiariesRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    // GET, DELETE 요청인 경우 params.uuid를 사용
    // PUT 요청인 경우 body.uuid를 사용
    const requestUuid = request.params.uuid
      ? request.params.uuid
      : request.body.uuid;
    const requestDiary =
      await this.diariesRepository.getDiaryByUuid(requestUuid);

    if (this.getUserId(request.user) === requestDiary.user.userId) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  private getUserId(user: any): string {
    return user.userId;
  }
}
