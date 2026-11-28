export type UserRole = "MEMBER" | "ADMIN" | "DEV";
export type UserStatus = "INACTIVE" | "ACTIVE_DEDUCTION" | "ACTIVE_FULL";
export type CodeType = "SYSTEM" | "DEDUCTION" | "FULL";
export type CodeStatus = "AVAILABLE" | "USED" | "REVOKED";
export type OrderAcquisition = "PURCHASED" | "CREDIT";
export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type DebtStatus = "OUTSTANDING" | "PAID";
export type CommissionType = "REFERRAL_BONUS" | "LEVEL_BONUS" | "DEBT_DEDUCTION";
export type CommissionStatus = "PENDING" | "CREDITED" | "REVERSED";
export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole[];
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
