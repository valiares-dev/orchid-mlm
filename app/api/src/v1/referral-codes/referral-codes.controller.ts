import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReferralCodesService } from './referral-codes.service';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';
import { CurrentUser, Public } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { ReferralCodePolicy } from './referral-codes.policy';
import { type User } from '@orchid-mlm/types';

@Controller('referral-codes')
export class ReferralCodesController {
  constructor(private readonly referralCodesService: ReferralCodesService) { }

  @Post('createCode')
  @Can(ReferralCodePolicy, 'generate')
  createCode(@Body() dto: CreateReferralCodeDto) {
    return this.referralCodesService.create(dto)
  }

  @Can.Anyone() // Will check on service
  @Post('revoke/:id')
  revokeCode(@CurrentUser() user: User, @Param('id') codeId: string) {
    return this.referralCodesService.revoke(codeId, user)
  }

  @Get()
  @Can.Anyone()
  viewAll(@CurrentUser() user: User) {
    return this.referralCodesService.findAll(user);
  }

  @Get('search')
  @Can.Anyone()
  viewCodeByOwner(@CurrentUser() user: User, @Query('q') q: string) {
    return this.referralCodesService.findCodeByOwner(user, q)
  }

  @Post('deleteCode/:id')
  @Can.Anyone()
  deleteCode(@Param('id') codeId: string, @CurrentUser() user: User) {
    return this.referralCodesService.remove(codeId, user)
  }
}
