$(document).ready(function() {
	if (lang == 'tw')
		$.get('data/items_tw.txt', function(data) {
			table.rows.add(JSON.parse(data)).draw();
		});
	else if (lang == 'cn')
		$.get('data/items_cn.txt', function(data) {
			table.rows.add(JSON.parse(data)).draw();
		});
	const title = {tw:'英文（雙擊複製）', cn:'英文（双击复制）'};
	const table = $('#tableArray').DataTable({
		columns: [
			{title: '中文'},
			{title: title[lang]}
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