import PluginComponent from '../plugin.component';
import Command from 'core/infrastructure/command'
import {TH_CORE_NAME, PIVOTBAR_NAME} from 'src/definition';
import TemplatePath from 'core/template/template.path';

TemplatePath
	.register(PIVOTBAR_NAME, () => {
		return {
			model: 'pivot',
			resource: 'content'
		};
	});

class Pivotbar extends PluginComponent('qgrid.plugins.pivotbar.tpl.html') {
	constructor() {
		super(...arguments);

		this.newGroup = null;
		this.add = new Command({
				execute: key => {
					const pivot = this.model.pivot;
					const state = pivot();
					pivot({
						by: state.by.concat(key)
					});

					this.newGroup = null;
				},
				canExecute: () => this.columns.length > 0
			}
		);

		this.remove = new Command({
			execute: key => {
				const pivot = this.model.pivot;
				const state = pivot();
				const index = state.by.findIndex(g => g === key);
				if (index >= 0) {
					const temp = Array.from(state.by);
					temp.splice(index, 1);
					pivot({
						by: temp
					});
				}
			}
		});

		this.drop = new Command({
			canExecute: e => e.source.key === TH_CORE_NAME && this.add.canExecute(e.source.value),
			execute: e => this.add.execute(e.source.value)
		});
	}

	get resource() {
		return this.model.pivot().resource;
	}

	get columns() {
		return this.model.data().columns;
	}

	get groups() {
		return this.model.pivot().by;
	}

	title(key) {
		const columns = this.columns;
		const index = columns.findIndex(c => c.key === key);
		return index >= 0 ? columns[index].title : '';
	}
}

export default Pivotbar.component({
	controller: Pivotbar,
	controllerAs: '$pivotbar'
});