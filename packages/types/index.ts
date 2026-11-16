export enum UserRole {
  USER = "MEMBER",
  ADMIN = "ADMIN",
  DEV = "DEV"
}

export enum UserStatus {
  INACTIVE = "INACTIVE",
  ACTIVE_DEDUCTION = "ACTIVE_DEDUCTION",
  ACTIVE_FULL = "ACTIVE_FULL"
}

export interface User {
  id: string;
  emaik: string;
  username: string;
  role: UserRole;
  referralCode: string;
  createdAt: Date;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: Date;
}
