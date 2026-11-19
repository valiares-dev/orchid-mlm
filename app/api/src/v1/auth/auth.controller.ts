import { Controller, Body, Get, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { CurrentUser, Public, SignInService } from '@nestjs/authentication';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import type { AuthUser } from '../user/user';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly signInService: SignInService
  ) { }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    const user = await this.authService.register(dto);
    await this.signInService.signIn(user.id, { method: 'password' }) // sets the cookies
    return user
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDTO) {
    const user = await this.authService.verifyLogin(dto);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    await this.signInService.signIn(user.id, { method: 'password' });
    return user;
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
