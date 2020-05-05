import React from "react";

function isObjectValueEqual(a: any, b: any): boolean {
	const A = Object.getOwnPropertyNames(a);
	const B = Object.getOwnPropertyNames(b);
	if (A.length != B.length) {
		return false;
	}
	for (let i = 0; i < A.length; i++) {
		const propName = A[i];
		const propA = a[propName];
		const propB = b[propName];
		if (typeof propA === "object") {
			const isEqual = isObjectValueEqual(propA, propB);
			return isEqual ? isEqual : false;
		} else if (propA !== propB) {
			return false;
		}
	}
	return true;
}

export interface IActionHooks<T extends object> {
	type: string | symbol;
	__TYPE: T;
}

export interface IReducerHooks<T, U extends T> {
	type: string | symbol;
	update: (state: T, payload: U) => T;
}

export class Store<IState extends object> {
	private context: React.Context<IState> | undefined;
	private reducers: IReducerHooks<IState, any>[] = [];
	private setState: React.Dispatch<React.SetStateAction<IState>> | undefined;

	constructor(private state: IState) {}

	dispatch = <T extends object>(
		action: IActionHooks<T>,
		payload: T,
		forceUpdate: boolean = false
	) => {
		for (let reducer of this.reducers) {
			if (reducer.type === action.type) {
				const state = reducer.update(this.state, payload);
				if (this.setState) {
					if (!forceUpdate && isObjectValueEqual(this.state, state)) {
						return;
					}
					this.setState(state);
				}
			}
		}
	};

	useDispatch = <T extends object>(action: IActionHooks<T>, payload: T) => {
		return React.useCallback(() => this.dispatch.bind(this)(action, payload, false), [
			this.state,
		]);
	};

	createAction = <T extends object>(payload: T): IActionHooks<T> => {
		const type = Symbol();
		return {
			type,
			__TYPE: payload,
		};
	};

	createReducer = <T extends object>(
		action: IActionHooks<T>,
		update: (state: IState, payload: T) => IState
	): void => {
		if (!this.reducers.map((item) => item.type).includes(action.type)) {
			this.reducers.push({ update, type: action.type });
		}
	};

	createContext = () => {
		[this.state, this.setState] = React.useState(this.state);
		this.context = React.createContext(this.state);
		return {
			Context: this.context,
			Consumer: this.context.Consumer,
			Provider: this.context.Provider,
			state: this.state,
		};
	};

	useStore = () => {
		if (!this || !this.context) {
			throw new Error(
				`Missing this, please use "store.useStore() "instead of "{ useStore }"`
			);
		}
		return {
			state: React.useContext(this.context),
			dispatch: this.dispatch.bind(this),
			useDispatch: this.useDispatch.bind(this),
		};
	};
}

export function createStore<IState extends object>(state: IState) {
	return new Store(state);
}
