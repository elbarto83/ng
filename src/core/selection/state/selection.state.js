import {isArray, isUndefined, isFunction} from 'core/services/utility';
import Node from 'core/node/node';
import AppError from 'core/infrastructure/error';

function defaultKey(item){
	return item;
}

export default class SelectionState {
	constructor(model, key = defaultKey) {

		if (!isFunction(key)){
			throw new AppError('single.selection.state', 'Key is not a function');
		}
		
		this.key = key;
		this.model = model;
	}

	select(item, state = true) {
		if (isArray(item)) {
			item.forEach(item => this.select(item, state));
			return;
		}

		if (item instanceof Node) {
			const rows = this.model.data().rows;
			item.rows.forEach(index => this.select(rows[index], state));
			return;
		}

		this.selectCore(item, state);
	}

	toggle(item, state) {
		if (isUndefined(state)) {
			state = this.state(item);
			return this.select(item, state === null || !state);
		}
		else {
			return this.select(item, state);
		}
	}

	state(item) {
		if (isArray(item)) {
			const all = item.every(item => this.state(item));
			return all ? true : item.some(item => this.state(item)) ? null : false;
		}

		if (item instanceof Node) {
			const rows = this.model.data().rows;
			const all = item.rows.every(index => this.state(rows[index]));
			return all ? true : item.rows.some(index => this.state(rows[index])) ? null : false;
		}

		return this.stateCore(item);
	}

	clear() {
		return this.clearCore();
	}

	selectCore() {
	}

	clearCore() {
	}

	stateCore() {
		return false;
	}

	get view() {
		return [];
	}
}