import { Module } from '@nestjs/common';
import { ReferralCodesService } from './referral-codes.service';
import { ReferralCodesController } from './referral-codes.controller';
import { ReferralCodesRepository } from './referral-codes.repository';
import { ReferralCodePolicy } from './referral-codes.policy';

@Module({
  controllers: [ReferralCodesController],
  providers: [ReferralCodesService, ReferralCodesRepository, ReferralCodePolicy],
})
export class ReferralCodesModule { }
