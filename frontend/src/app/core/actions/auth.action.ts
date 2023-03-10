import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  Login = '[Login] Action',
  Logout = '[Logout] Action',
  UserRequested = '[Request User] Action',
  UserLoaded = '[Load User] Auth API'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: { token: string }) { }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class UserRequested implements Action {
  readonly type = AuthActionTypes.UserRequested;
}

export class UserLoaded implements Action {
  readonly type = AuthActionTypes.UserLoaded;
  constructor(public payload: { user: any }) { }
}



export type AuthActions = Login | Logout | UserRequested | UserLoaded;
