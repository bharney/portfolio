import * as Account from './Account';
import Alert, { AlertState } from './Alert';
import * as Profile from './Profile';
import * as Session from './Session';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
// The top-level state object
export interface ApplicationState {
	session: Session.SessionState;
	alert: AlertState;
	account: Account.AccountState;
	profile: Profile.ProfileState;
}
// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
	session: Session.reducer,
	alert: Alert.reducer,
	account: Account.reducer,
	profile: Profile.reducer
};

export const rootReducers = combineReducers(reducers);

export type AppState = ReturnType<typeof rootReducers>;

export type TypedDispatch<T> = ThunkDispatch<T, any, UnknownAction>;

export const useAppDispatch = () => useDispatch<TypedDispatch<AppState>>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type AppThunkAction<TAction> = (dispatch: (action: TAction) => void, getState: () => ApplicationState) => void;
