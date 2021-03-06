import {View} from '../view';

export class PaginationView extends View {
	constructor(model) {
		super(model);

		model.dataChanged.watch(e => {
			if (e.hasChanges('rows') && e.tag.behavior !== 'core') {
				model.pagination({
					current: 0
				});
			}
		});

		model.filterChanged.watch(e => {
			if (e.hasChanges('by')) {
				model.pagination({
					current: 0
				});
			}
		});

		model.pivotChanged.watch(e => {
			if (e.hasChanges('by')) {
				model.pagination({
					current: 0
				});
			}
		});

		model.groupChanged.watch(e => {
			if (e.hasChanges('by')) {
				model.pagination({
					current: 0
				});
			}
		});
	}

	get current() {
		return this.model.pagination().current;
	}

	get size() {
		return this.model.pagination().size;
	}
}