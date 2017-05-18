import Box from './box';
import Data from './data';
import Layer from './layer';
import {EventListener} from '@grid/core/infrastructure';
import {Element} from './element';
import {HEAD_CORE_NAME, BODY_CORE_NAME, FOOT_CORE_NAME} from '@grid/view/definition';
import {AppError} from '@grid/core/infrastructure';

export default class Table {
	constructor(model, markup, template) {
		this.model = model;
		this.markup = markup;
		this.template = template;
		this.layers = new Map();

		this._head = null;
		this._body = null;
		this._foot = null;
		this._view = null;

		this.isFocused = this.isFocused.bind(this);
	}

	isFocused() {
		const markup = this.markup;
		const target = markup.table;
		let current = markup.document.activeElement;
		while (current) {
			if (current === target) {
				return true;
			}

			current = current.parentNode;
		}

		return false;
	}

	keyDown(f) {
		return new EventListener(this, this.markup.document)
			.on('keydown', f);
	}

	get head() {
		if (this._head) {
			return this._head;
		}

		const document = this.markup.document;
		const head = this.markup.head;
		return this._head = new Box(document, head, this.template, HEAD_CORE_NAME);
	}

	get body() {
		if (this._body) {
			return this._body;
		}

		const document = this.markup.document;
		const body = this.markup.body;
		if (document && body) {
			return this._body = new Box(document, body, this.template, BODY_CORE_NAME);
		}
		return Box.empty;
	}

	get foot() {
		if (this._foot) {
			return this._foot;
		}

		const document = this.markup.document;
		const foot = this.markup.foot;
		if (document && foot) {
			return this._foot = new Box(document, foot, this.template, FOOT_CORE_NAME);
		}
		return Box.empty;
	}

	get data() {
		return new Data(this.model);
	}

	get view() {
		if (this._view) {
			return this._view;
		}

		const view = this.markup.view;
		if (view) {
			return this._view = new Element(view);
		}
		return Element.empty;
	}

	focus() {
		this.markup.table.focus();
	}

	blur() {
		this.markup.table.blur();
	}

	addLayer(name) {
		const layers = this.layers;
		if (layers.has(name)) {
			return layers.get(name);
		}

		const node = this.document.createElement(`div`);
		node.classList.add(name);
		this.element.appendChild(node);

		const ctrl = angular.element(this.element).controller(this.name);
		if (!ctrl) {
			throw new AppError('box', 'Controller for box is not found')
		}

		if (!ctrl.$scope) {
			throw new AppError('box', 'Controller scope for box is not found')
		}

		const layer = new Layer(ctrl.$scope, node, this.template);
		layers.set(name, layer);
		return layer;
	}

	removeLayer(name) {
		const layers = this.layers;
		if (layers.has(name)) {
			const layer = layers.get(name);
			layer.destroy();
			layer.element.parentElement.removeChild(layer.element);
			layers.delete(name);
		}
	}
}