export interface IUsePayload {
  name: string;
  email: string;
  password: string;
}


export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  youtube_access_token: string;
  twitter_refresh_token: string;
  twitter_access_token: string;
  twitter_token: string;
  twitter_tokenSecret: string;
  youtube_refresh_token: string;
  date: string; // Date string
  scheduleTime: number;
  id: string;
}

export interface AccessToken {
  token: string;
  expires: string; // Date string
}

export interface RefreshToken {
  token: string;
  expires: string; // Date string
}

export interface Tokens {
  access: AccessToken;
  refresh: RefreshToken;
}

export interface ILoginResponse {
  user: IUser;
  tokens: Tokens;
}


export type TLoginService = (payload: ILoginPayload) => Promise<ILoginResponse>;
export type TSignupService = (payload: IUsePayload) => Promise<ILoginResponse>;