import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module';
import { SessionAuth } from './session-auth.provide';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuth]
})
export class AuthModule { }
