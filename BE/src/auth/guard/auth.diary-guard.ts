import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { JwtAuthGuard } from "./auth.jwt-guard";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";

@Injectable()
export class PrivateDiaryGuard extends JwtAuthGuard {
  constructor(
    @InjectRedis() protected readonly redisClient: Redis,
    private readonly diariesRepository: DiariesRepository,
  ) {
    super(redisClient);
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

    if (requestUuid === undefined) {
      throw new BadRequestException("일기 uuid는 비어있지 않아야 합니다.");
    }

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
