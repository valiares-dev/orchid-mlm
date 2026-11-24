import { Module } from '@nestjs/common';
import { ReferralCodesService } from './referral-codes.service';
import { ReferralCodesController } from './referral-codes.controller';
import { ReferralCodesRepository } from './referral-codes.repository';

@Module({
  controllers: [ReferralCodesController],
  providers: [ReferralCodesService, ReferralCodesRepository],
})
export class ReferralCodesModule { }
