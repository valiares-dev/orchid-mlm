import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { eq, and, like } from "drizzle-orm";
import type { Database, DbExecutor } from "../../db/database";
import { NewReferralCode, referral_code, referral_codes_uses } from "../../db/schema";
import { randomBytes } from "crypto";
import { CreateReferralCodeDto } from "./dto/create-referral-code.dto";

@Injectable()
export class ReferralCodesRepository {
  constructor(
    @InjectDrizzle()
    private readonly db: Database
  ) { }

  async findUsable(code: string, executor: DbExecutor) {
    const [row] = await executor.select({
      code: referral_code.code,
      type: referral_code.type,
      status: referral_code.status,
      issueBy: referral_code.issued_by
    })
      .from(referral_code)
      .where(and(eq(referral_code.code, code), eq(referral_code.status, 'AVAILABLE')))
      .limit(1)
    return row ?? null;
  }

  async recordUse(codeId: string, userId: string, executor: DbExecutor) {
    return executor.insert(referral_codes_uses).values({
      code_id: codeId,
      user_id: userId,
    }).returning()
  }

  async createMemberCode(userId: string) {
    const types = ['DEDUCTION', 'FULL'] as const;

    const row: NewReferralCode[] = types.map((type) => ({
      code: this.generateMemberCode(),
      type,
      issued_by: userId,
    }))

    return row ?? null;
  }

  async createSystemCode(userId: string) {
    const types = ['SYSTEM'] as const;

    const row: NewReferralCode[] = types.map((type) => ({
      code: this.generateMemberCode(),
      type,
      issued_by: userId
    }))

    return row ?? null;
  }

  // TODO: Don't forget that it will only dev and admin can call this repo    
  async findAll() {
    return this.db.select().from(referral_code)
  }

  // TODO: Controller name findCodeByOwner
  async findCodeByOwner(code: string) {
    return this.db.select().from(referral_code).where(like(referral_code.code, code));
  }

  async findCodeById(codeId: string) {
    return this.db.select().from(referral_code).where(eq(referral_code.id, codeId));
  }

  // TODO: Admin & Dev control
  async revokeCode(codeId: string) {
    const rows = await this.db.update(referral_code)
      .set({
        status: "REVOKED"
      })
      .where(eq(referral_code.id, codeId))
      .returning({ id: referral_code.id });

    return rows.length > 0;
  }

  // TODO: Create A controller for this
  async createCode(dto: CreateReferralCodeDto, executor: DbExecutor) {
    const [row] = await executor.insert(referral_code).values({
      code: dto.code,
      type: dto.type,
      issued_by: dto.issuedBy,
    }).returning({
      code: referral_code.code,
      type: referral_code.type,
      issued_by: referral_code.issued_by
    })

    return row ?? null;
  }

  generateMemberCode(length: number = 8) {
    const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

    const bytes = randomBytes(length);

    let code: string = ''

    for (let i = 0; i < length; i++) {
      code += charset[bytes[i] % charset.length];
    };

    return code;
  }
}
