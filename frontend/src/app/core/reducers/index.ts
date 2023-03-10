// NGRX
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';

import { environment } from '../../../environments/environment';

// tslint:disable-next-line:no-empty-interface
export interface AppState { }

export const reducers: ActionReducerMap<AppState> = { router: routerReducer };

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
