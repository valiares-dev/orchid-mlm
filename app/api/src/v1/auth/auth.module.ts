import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module';
import { SessionAuth } from './session-auth.provide';
import { ReferralCodesModule } from '../referral-codes/referral-codes.module';

@Module({
  imports: [UserModule, ReferralCodesModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuth]
})
export class AuthModule { }
