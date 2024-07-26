$(document).ready(function() {
	$.get('data/items.txt', function(data) {
		table.rows.add(JSON.parse(data)).draw();
	});
	const table = $('#tableArray').DataTable({
		columns: [
			{title: '中文'},
			{title: '英文（雙擊複製）'}
		],
		fixedColumns: true,
		search: {regex: true},
		pageLength: 25
	});
	$('#tableArray').on('dblclick', 'tr', function () {
		let data = table.row(this).data();
		navigator.clipboard.writeText(data[1]);
	});
});
