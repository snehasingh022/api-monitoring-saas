export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

export type LoginResponse = {
  user: User;
  tokens: AuthTokens;
};

export type RegisterResponse = {
  user: User;
};
