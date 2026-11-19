import { Injectable } from "@nestjs/common";
import { AuthenticationRegistry, SessionCookieProvider, type SessionRecord } from '@nestjs/authentication';
import type { AuthUser } from "../user/user";
import { UserRepository } from "../user/user.repository";

@Injectable()
export class SessionAuth extends SessionCookieProvider<AuthUser> {
  constructor(
    private readonly userRepository: UserRepository,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  validate(session: SessionRecord) {
    return this.userRepository.findById(session.userId)
  }
}
