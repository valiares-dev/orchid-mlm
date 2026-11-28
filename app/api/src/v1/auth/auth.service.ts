import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import type { AuthUser } from '../user/user';
import { UserRepository } from '../user/user.repository';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  // TODO: Check code status then apply the account status as well
  async register(dto: RegisterDTO): Promise<AuthUser> {
    if (await this.userRepository.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }

    const hashPassword = await this.passwordHasher.hash(dto.password)

    return this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash: hashPassword,
      phone: dto.phone
    })

  }

  async verifyLogin(dto: LoginDTO): Promise<AuthUser | null> {
    const found = await this.userRepository.findCredentials(dto.email);

    const valid = await this.passwordHasher.verify(dto.password, found?.passwordHash);

    if (!valid || !found?.user.isActive) return null;

    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      await this.userRepository.updatePasswordHash(
        found.user.id,
        await this.passwordHasher.hash(dto.password)
      )
    }
    return found.user;
  }

}
