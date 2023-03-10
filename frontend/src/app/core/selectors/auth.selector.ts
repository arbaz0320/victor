// NGRX
import { createSelector } from '@ngrx/store';
// Lodash
export const selectAuthState = (state: any) => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.loggedIn
);

export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);

export const currentAuthToken = createSelector(
  selectAuthState,
  (auth) => auth.authToken
);

export const isUserLoaded = createSelector(
  selectAuthState,
  (auth) => auth.isUserLoaded
);

export const currentUser = createSelector(selectAuthState, (auth) => auth.user);

export const currentUserRoleIds = createSelector(currentUser, (user) => {
  if (!user) {
    return [];
  }

  return user.roles;
});
