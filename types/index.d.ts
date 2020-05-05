import React from "react";
export interface IActionHooks<T extends object> {
	type: string | symbol;
	__TYPE: T;
}
export interface IReducerHooks<T, U extends T> {
	type: string | symbol;
	update: (state: T, payload: U) => T;
}
export declare class Store<IState extends object> {
	private state: IState;
	private context: React.Context<IState> | undefined;
	private reducers: IReducerHooks<IState, any>[];
	private setState: React.Dispatch<React.SetStateAction<IState>> | undefined;
	constructor(state: IState);
	dispatch: <T extends object>(
		action: IActionHooks<T>,
		payload: T,
		forceUpdate?: boolean
	) => void;
	useDispatch: <T extends object>(
		action: IActionHooks<T>,
		payload: T
	) => () => void;
	createAction: <T extends object>(payload: T) => IActionHooks<T>;
	createReducer: <T extends object>(
		action: IActionHooks<T>,
		update: (state: IState, payload: T) => IState
	) => void;
	createContext: () => {
		Context: React.Context<IState>;
		Consumer: React.Consumer<IState>;
		Provider: React.Provider<IState>;
		state: IState;
	};
	useStore: () => {
		state: IState;
		dispatch: <T extends object>(
			action: IActionHooks<T>,
			payload: T,
			forceUpdate?: boolean
		) => void;
		useDispatch: <T_1 extends object>(
			action: IActionHooks<T_1>,
			payload: T_1
		) => () => void;
	};
}
export declare function createStore<IState extends object>(
	state: IState
): Store<IState>;
