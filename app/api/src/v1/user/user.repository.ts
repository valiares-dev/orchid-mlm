import { ConflictException, Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { eq } from "drizzle-orm";
import type { Database } from "../../db/database";
import { users } from "../../db/schema";
import type { AuthUser } from "./user";

// whitelist when returning the table 
const safeColumns = {
  id: users.id,
  email: users.email,
  username: users.username,
  role: users.role,
  status: users.account_status,
  isActive: users.is_active
}

// interface for the input when inserting new user
export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
  phone?: string;
  sponsorId?: string;
}

const normalizeEmail = (email: string) => email.trim().normalize('NFC').toLowerCase();

@Injectable()
export class UserRepository {
  constructor(@InjectDrizzle() private readonly db: Database) { }

  async findById(id: string): Promise<AuthUser | null> {
    const [row] = await this.db.select(safeColumns).from(users).where(eq(users.id, id));

    return row ?? null;
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const [row] = await this.db.select(safeColumns).from(users).where(eq(users.email, normalizeEmail(email))).limit(1);

    return row ?? null;
  }

  async findCredentials(email: string): Promise<{ user: AuthUser; passwordHash: string } | null> {
    const [row] = await this.db.select({ ...safeColumns, passwordHash: users.password_hash }).from(users).where(eq(users.email, normalizeEmail(email))).limit(1)

    if (!row) return null;

    const { passwordHash, ...user } = row;
    return { user, passwordHash };
  }

  async create(input: CreateUserInput): Promise<AuthUser> {
    try {
      const [row] = await this.db.insert(users).values({
        username: input.username.trim(),
        email: normalizeEmail(input.email),
        password_hash: input.passwordHash,
        phone: input.phone,
        sponsor_id: input.sponsorId,
        terms_accepted_at: new Date()
      })
        .returning(safeColumns);

      return row;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException('Email or username is already in use');
      }

      throw err;
    }
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.db.update(users).set({ password_hash: passwordHash }).where(eq(users.id, id))
  }

  private isUniqueViolation(err: unknown): boolean {
    const e = err as { code?: string; cause?: { code?: string } };
    return e?.code === '23505' || e?.cause?.code === '23505';
  }
}
