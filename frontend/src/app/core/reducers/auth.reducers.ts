// Actions
import { AuthActions, AuthActionTypes } from '../actions/auth.action';

export interface AuthState {
  loggedIn: boolean;
  token: string | undefined;
  user: any;
  isUserLoaded: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  token: undefined,
  user: undefined,
  isUserLoaded: false,
};

export function authReducer(
  state = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        loggedIn: true,
        token: action.payload.token,
        user: undefined,
        isUserLoaded: false,
      };
    }

    case AuthActionTypes.Logout:
      return initialAuthState;

    case AuthActionTypes.UserLoaded: {
      const _user: any = action.payload.user;
      return {
        ...state,
        user: _user,
        isUserLoaded: true,
      };
    }

    default:
      return state;
  }
}
