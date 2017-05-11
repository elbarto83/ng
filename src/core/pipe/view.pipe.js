import {flatView as nodeFlatView} from '@grid/core/node/node.service';

export default function pipeView(memo, context, next) {
	const model = context.model;
	const rows = memo.nodes.length ? nodeFlatView(memo.nodes) : memo.rows;

	model.view({
		rows: rows,
		nodes: memo.nodes,
		pivot: memo.pivot,
		columns: memo.columns
	}, {
		source: 'view.pipe',
		behavior: 'core'
	});

	next(memo);
}