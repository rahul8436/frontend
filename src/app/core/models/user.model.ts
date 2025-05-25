export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
} 