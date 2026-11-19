import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestjs/drizzle';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  imports: [
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        drizzle,
        connection: config.getOrThrow<string>('NEON_DEV_DATABASE_URL'),
      })
    })
  ]
})
export class DbModule { }
