import { IsString, IsOptional, MaxLength } from "class-validator";
import type { CodeType, CodeStatus } from "@orchid-mlm/types";

export class CreateReferralCodeDto {
  @IsString()
  @MaxLength(8)
  code!: string;

  @IsString()
  type!: CodeType;

  @IsString()
  issuedBy!: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  status?: CodeStatus
}
