import { Test, TestingModule } from '@nestjs/testing';
import { ReferralCodesController } from './referral-codes.controller';
import { ReferralCodesService } from './referral-codes.service';

describe('ReferralCodesController', () => {
  let controller: ReferralCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralCodesController],
      providers: [ReferralCodesService],
    }).compile();

    controller = module.get<ReferralCodesController>(ReferralCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
