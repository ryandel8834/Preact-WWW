import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { mapActions } from 'unistore/src/util';

/**
 * Store context that will be passed around the app. Complex shared state
 * should be stored here.
 */
export const storeCtx = createContext();

function mapStateToProps(keys, state) {
	return keys.reduce((acc, key) => {
		acc[key] = state[key];
		return acc;
	}, {});
}

/**
 * Wire a component up to the store. Passes state as props, re-renders on change.
 * @param {string[]} keys A function mapping of store
 * state to prop values, or an array/CSV of properties to map.
 * @param {Function|Object} [actions] Action functions (pure state mappings),
 * or a factory returning them. Every action function gets current state as the
 * first parameter and any other params next
 */
export function useStore(keys = [], actions) {
	const store = useContext(storeCtx);
	let [currentState, setCurrentState] = useState(
		mapStateToProps(keys, store.getState())
	);

	useEffect(() => {
		const update = () => {
			let mapped = mapStateToProps(keys, store.getState());
			for (let i in mapped) {
				if (mapped[i] !== currentState[i]) {
					return setCurrentState(mapped);
				}
			}

			for (let i in currentState) {
				if (!(i in mapped)) {
					return setCurrentState(mapped);
				}
			}
		};

		const dispose = store.subscribe(update);
		return dispose;
	}, [currentState]);

	return {
		state: currentState,
		actions: actions ? mapActions(actions, store) : { store },
		update: s => store.setState(Object.assign(store.getState, s))
	};
}

/**
 * The hooks version of component.forceUpdate();
 */
export function useForceUpdate() {
	let [v, set] = useState(0);
	return () => set(++v);
}
