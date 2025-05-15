$(document).ready(function() {
	$.get('data/items_' + lang + '.txt', function(data) {
		table.rows.add(JSON.parse(data)).draw();
	});
	const title = {tw:'英文（雙擊複製）', cn:'英文（双击复制）'};
	const table = $('#tableArray').DataTable({
		columns: [
			{title: '中文', width: '400px'},
			{title: title[lang]}
		],
		autoWidth: false,
		deferRender: true,
		search: {regex: true},
		ordering: false,
		pageLength: 25,
		layout: {
			bottom: 'paging',
			bottomStart: null,
			bottomEnd: null
		},
		language: tableText
	});
	$('#tableArray').on('dblclick', 'tr', function () {
		let data = table.row(this).data();
		navigator.clipboard.writeText(data[1]);
	});
});