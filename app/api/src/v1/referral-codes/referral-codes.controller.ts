import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReferralCodesService } from './referral-codes.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';
import { Public } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';

@Controller('referral-codes')
export class ReferralCodesController {
  constructor(private readonly referralCodesService: ReferralCodesService) { }

  @Post('createCode')
  createCode(@Body() dto: CreateReferralCodeDto) {
    return this.referralCodesService.create(dto)
  }

  @Public()
  @Can.Anyone()
  @Post('revoke/:id')
  revokeCode(@Param('id') codeId: string) {
    return this.referralCodesService.revoke(codeId)
  }
}
