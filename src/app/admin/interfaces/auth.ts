export interface TokenPayload {
  at_hash: string;
  aud: string;
  auth_time: number;
  ['cognito:username']: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  given_name?: string;
  name: string;
  sub: string;
  token_use: 'access' | 'id';
  preferred_username?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  userName: string;
}
