import { IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';
import { CreateReferralCodeDto } from './create-referral-code.dto';

export class UpdateReferralCodeDto extends PartialType(CreateReferralCodeDto) {
  @IsString()
  codeId: string;
}
