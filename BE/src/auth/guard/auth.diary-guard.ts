import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DiariesRepository } from "src/diaries/diaries.repository";

@Injectable()
export class PrivateDiaryGuard extends AuthGuard("jwt") {
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
      throw new NotFoundException("존재하지 않는 일기입니다.");
    }
  }

  private getUserId(user: any): string {
    return user.userId;
  }
}
