export enum OperationStatus {
  COMPLETED, ABORTED, FAILED
}

export interface UserProfile {
  name: string,
  email: string,
  authToken: string,
  expiresAt: number
}

export interface LoginResponse {
  success: boolean,
  message: string,
  token: string,
  tokenExpiresInSec: string
  profile: {
    name: string,
    email: string
  }
}

export interface SignupResponse {
  success: boolean,
  message: string,
  error: {},
  profile: {
    name: string,
    email: string
  }
}
