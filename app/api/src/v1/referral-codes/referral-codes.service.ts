import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';
import { ReferralCodesRepository } from './referral-codes.repository';
import type { Database } from '../../db/database';
import { InjectDrizzle } from '@nestjs/drizzle';
import { ReferralCodePolicy } from './referral-codes.policy';
import { ReferralCode } from '../../db/schema';
import type { User } from '@orchid-mlm/types';

@Injectable()
export class ReferralCodesService {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
    private readonly referralCodeRepo: ReferralCodesRepository,
    private readonly authz: AuthorizationService
  ) { }

  async create(dto: CreateReferralCodeDto) {

    return this.db.transaction(async (tx) => {
      const exist = await this.referralCodeRepo.findUsable(dto.code, tx)
      if (exist) throw new ConflictException('The code has already registered');

      const row = await this.referralCodeRepo.createCode(dto, tx)
      return row ?? null;
    })
  }

  async revoke(codeId: string, user: User) {
    const [code] = await this.referralCodeRepo.findCodeById(codeId)
    if (!code) throw new NotFoundException('Code was not exist')
    await this.authz.authorize(ReferralCodePolicy, "revoke", user, code)
    const row = await this.referralCodeRepo.revokeCode(codeId);

    return row ?? null;
  }

  async findAll(user: User) {
    console.log(user)
    // Gives error if not giveni
    await this.authz.authorize(ReferralCodePolicy, "viewAll", user)
    const row = await this.referralCodeRepo.findAll()
    return { count: row.length, row };
  }

  async findCodeByOwner(user: User, search: string) {
    await this.authz.authorize(ReferralCodePolicy, "viewCode", user)
    const row = this.referralCodeRepo.findCodeByOwner(search)

    return row ?? null;
  }

  async remove(codeId: string, user: User) {
    await this.authz.authorize(ReferralCodePolicy, "remove", user)

    return this.db.transaction(async (tx) => {
      const [exist] = await this.referralCodeRepo.findCodeById(codeId)

      if (!exist) throw new ConflictException('The code was never existed.')

      const row = this.referralCodeRepo.deleteCode(codeId, tx)
      return row ?? null;
    })
  }

  async createSystemCode(userId: string) {
    // const exist = await this.referralCodeRepo.findUsable()
  }
}
