import {ColumnView} from './column.model.view';
import {ColumnModel} from './column.model';
import {TemplatePath} from '../template';

TemplatePath.register('row-expand-cell', (template, column) => {
	return {
		model: template.for,
		resource: column.key
	};
});

class RowExpandColumnModel extends ColumnModel {
	constructor() {
		super('row-expand');

		this.key = '$row.expand';
		this.title = 'Expand';

		this.canEdit = false;
		this.canResize = false;
		this.class = 'control';
	}
}

export class RowExpandColumn extends ColumnView {
	constructor(model) {
		super(model);
	}

	static model(model) {
		return model ? RowExpandColumn.assign(model) : new RowExpandColumnModel();
	}
}