$(document).ready(function() {
	$.get('data/items.txt', function(data) {
		table.rows.add(JSON.parse(data)).draw();
	});
	const table = $('#tableArray').DataTable({
		columns: [
			{title: '中文'},
			{title: '英文'}
		],
		fixedColumns: true,
		search: {regex: true},
		pageLength: 25
	});
});