export enum UserRole {
    USER =  "USER",
    ADMIN = "ADMIN",
    DEV = "DEV"
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