import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';
import { ReferralCodesRepository } from './referral-codes.repository';
import type { Database } from '../../db/database';
import { InjectDrizzle } from '@nestjs/drizzle';

@Injectable()
export class ReferralCodesService {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
    private readonly referralCodeRepo: ReferralCodesRepository
  ) { }

  async create(dto: CreateReferralCodeDto) {

    return this.db.transaction(async (tx) => {
      const exist = await this.referralCodeRepo.findUsable(dto.code, tx)
      if (exist) new ConflictException('The code has already registered');

      const row = await this.referralCodeRepo.createCode(dto, tx)
      return row ?? null;
    })
  }

  async revoke(codeId: string) {
    const row = await this.referralCodeRepo.revokeCode(codeId);

    return row ?? null;
  }

  findAll() {
    return `This action returns all referralCodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} referralCode`;
  }

  update(id: number, updateReferralCodeDto: UpdateReferralCodeDto) {
    return `This action updates a #${id} referralCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} referralCode`;
  }
}
