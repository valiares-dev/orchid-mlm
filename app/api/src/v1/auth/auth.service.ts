import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import type { AuthUser } from '../user/user';
import { UserRepository } from '../user/user.repository';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ReferralCodesRepository } from '../referral-codes/referral-codes.repository';
import { InjectDrizzle } from '@nestjs/drizzle';
import type { Database } from '../../db/database';
import type { UserStatus } from '@orchid-mlm/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectDrizzle()
    private readonly db: Database,
    private readonly userRepository: UserRepository,
    private readonly referralCodeRepository: ReferralCodesRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  // TODO: Check code status then apply the account status as well
  async register(dto: RegisterDTO) {
    if (await this.userRepository.findByEmail(dto.email)) {
      throw new ConflictException('Email already registered');
    }

    const hashPassword = await this.passwordHasher.hash(dto.password)

    return this.db.transaction(async (tx) => {
      const exist = await this.referralCodeRepository.findUsable(dto.referralCode, tx)
      if (!exist) throw new NotFoundException('Code was not registered')

      let accountStatus: 'INACTIVE' | 'ACTIVE_DEDUCTION' | 'ACTIVE_FULL';

      if (exist.type === 'DEDUCTION') {
        accountStatus = 'ACTIVE_DEDUCTION';
      } else if (exist.type === 'FULL') {
        accountStatus = 'ACTIVE_FULL';
      } else if (exist.type === 'SYSTEM') {
        accountStatus = 'INACTIVE';
      } else {
        throw new Error(`Unexpected code type: ${exist.type}`);
      }

      return this.userRepository.create(
        {
          username: dto.username,
          email: dto.email,
          passwordHash: hashPassword,
          phone: dto.phone,
          accountStatus,
        },
        tx,
      );
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
