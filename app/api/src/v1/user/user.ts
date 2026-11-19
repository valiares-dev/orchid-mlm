export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'MEMBER' | 'ADMIN' | 'DEV';
  status: 'INACTIVE' | 'ACTIVE_DEDUCTION' | 'ACTIVE_FULL';
  isActive: boolean;
}
