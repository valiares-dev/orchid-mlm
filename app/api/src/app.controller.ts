import { Controller, Get } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { Public } from '@nestjs/authentication';
import type { HealthCheckResponse } from '@orchid-mlm/types'
import type { Database } from './db/database';
import { sql } from 'drizzle-orm';
import { users } from './db/schema';
import { Can } from '@nestjs/authorization';

@Controller()
export class AppController {
  constructor(@InjectDrizzle() private readonly db: Database) { }

  // TODO: Remove the Can Anyone after the finalization
  @Public()
  @Can.Anyone()
  @Get('health') // /api/health/
  health(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date()
    }
  }

  // TODO: Remove the Can anyone after the finalizatoin
  @Public()
  @Can.Anyone()
  @Get('db-test')
  async dbTest() {
    const ping = await this.db.execute(sql`select 1 as ok`);
    const rows = await this.db.select().from(users).limit(5);
    return { connected: ping.rows.length > 0, row: rows.length, users: rows };
  }
}
