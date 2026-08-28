export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: AuthenticatedUser;
}

export type LoginResponse = AuthSession;
