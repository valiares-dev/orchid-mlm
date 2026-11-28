import { Policy } from "@nestjs/authorization";
import { User } from "@orchid-mlm/types";
import type { ReferralCode } from "../../db/schema";

const isAdmin = (user: User | null) => !!user?.role.includes('ADMIN') || !!user?.role.includes('DEV')

const isOwner = (user: User | null, code: ReferralCode | null) => !!user && code?.issued_by === user.id


@Policy()
export class ReferralCodePolicy {
  generate(user: User | null) {
    return isAdmin(user)
  }

  view(user: User | null, code: ReferralCode) {
    return isOwner(user, code) || isAdmin(user)
  }

  viewAll(user: User) {
    return isAdmin(user)
  }

  remove(user: User) {
    return isAdmin(user)
  }

  viewCode(user: User) {
    return isAdmin(user)
  }

  revoke(user: User | null, code: ReferralCode) {
    return (
      (isOwner(user, code) || isAdmin(user)) && code.status === 'AVAILABLE'
    )
  }
}
