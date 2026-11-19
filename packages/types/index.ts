export enum UserRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  DEV = "DEV"
}

export enum UserStatus {
  INACTIVE = "INACTIVE",
  ACTIVE_DEDUCTION = "ACTIVE_DEDUCTION",
  ACTIVE_FULL = "ACTIVE_FULL"
}

export enum CodeType {
  SYSTEM = "SYSTEM",
  DEDUCTION = "DEDUCTION",
  FULL = "FULL",
}

export enum CodeStatus {
  AVAILABLE = "AVAILABLE",
  USED = "USED",
  REVOKED = "REVOKED",
}

export enum OrderAcquisition {
  PURCHASED = "PURCHASED",
  CREDIT = "CREDIT",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum DebtStatus {
  OUTSTANDING = "OUTSTANDING",
  PAID = "PAID",
}

export enum CommissionType {
  REFERRAL_BONUS = "REFERRAL_BONUS",
  LEVEL_BONUS = "LEVEL_BONUS",
  DEBT_DEDUCTION = "DEBT_DEDUCTION",
}

export enum CommissionStatus {
  PENDING = "PENDING",
  CREDITED = "CREDITED",
  REVERSED = "REVERSED",
}

export enum WithdrawalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
