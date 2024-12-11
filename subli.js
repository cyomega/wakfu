$(document).ready(function() {
	$.get('data/subli.txt', function(data) {
		table.rows.add(JSON.parse(data)).draw();
	});
	function socketsComboBtn () {
		let options = [];
		let socketsOrder = ['一', '二', '三', '四'];
		let needle1 = socketsCombo[0] + socketsCombo[1] + socketsCombo[2];
		let needle2 = socketsCombo[1] + socketsCombo[2] + socketsCombo[3];
		for (let i = 0; i < 4; i++) {
			options.push({
				extend: 'spacer',
				text: '第' + socketsOrder[i] + '孔'
			});
			for (let j = 0; j < 4; j++) {
				let k;
				if (j == 0)
					k = '\\d';
				else
					k = j.toString();
				options.push({
					text: sockets[j],
					action: function (e, dt) {
						socketsCombo[i] = k;
						socketsComboName[i] = sockets[j];
						needle1 = socketsCombo[0] + socketsCombo[1] + socketsCombo[2];
						needle2 = socketsCombo[1] + socketsCombo[2] + socketsCombo[3];
						needle = '(' + needle1 + '|' + needle2 + ')';
						dt.buttons(3).text(socketsComboName);
						dt.column(4).search(needle, true).draw();
					}
				});
			}
		}
		options.push({
			text: sockets[6],
			action: function (e, dt) {
				socketsCombo[3] = 'cyz';
				socketsComboName[3] = sockets[6];
				needle = '(' + needle1 + ')';
				dt.buttons(3).text(socketsComboName);
				dt.column(4).search(needle, true).draw();
			}
		});
		return options;
	}
	let needle;
	const sockets = [
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><circle r="12" cx="14" cy="13" style="fill:PaleGoldenRod; stroke:Black" />/svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><rect width="22" height="23" x="3" y="3" style="fill:FireBrick; stroke:Black" /></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><polygon points="14 1,26 12,21 25,7 25,2 12" style="fill:ForestGreen; stroke:Black" /></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><polygon points="14 1,26 25,2 25" style="fill:DodgerBlue; stroke:Black" /></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><polygon points="7 1,21 1,26 9,14 25,2 9" style="fill:DarkOrchid; stroke:Black" /></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><polygon points="7 1,21 1,26 9,14 25,2 9" style="fill:HotPink; stroke:Black" /></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><text y="21" font-size="20">❌</text></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><text y="19" font-size="20">📜</text></svg>'
	];
	const socketsCombo = ['\\d', '\\d', '\\d', '\\d'];
	const socketsComboName = [sockets[0], sockets[0], sockets[0], sockets[0]];
	const table = $('#tableArray').DataTable({
		columns: [
			{title: '名稱', data: null, width: 10},
			{title: '附魔', data: null, width: 10},
			{title: '效果', data: 5},
			{title: '掉落', data: 6},
			{visible: false, data: 3}
		],
		fixedColumns: true,
		autoWidth: false,
		search: {regex: true},
		pageLength: 10,
		dom: 'Blfrtip',
		buttons: [
			{
				text: sockets[4],
				action: function (e, dt) {
					dt.column(4).search('4').draw();
				}
			},
			{
				text: sockets[5],
				action: function (e, dt) {
					dt.column(4).search('5').draw();
				}
			},
			{
				text: sockets[7],
				action: function (e, dt) {
					dt.column(4).search(needle, true).draw();
				}
			},
			{
				extend: 'collection',
				text: socketsComboName,
				collectionLayout: 'columns',
				buttons: socketsComboBtn()
			},
			{
				extend: 'spacer',
				style: 'empty'
			}
		],
		rowCallback: function(row, data) {
			$('td:eq(0)', row).html(function() {
				return '<div style="position: relative; top: 5px; min-height: 45px">' + data[0] + ' ' + data[2] + '<br>' + data[1] + '</div>';
			});
			$('td:eq(1)', row).html(function() {
				if (data[3].charAt(0) < 4)
					return sockets[data[3].charAt(0)] + sockets[data[3].charAt(1)] + sockets[data[3].charAt(2)] + '<br>上限：' + data[4];
				else
					return sockets[data[3].charAt(0)];
			});
		},
		headerCallback: function (thead, data, start, end, display) {
			$(this.api().column(0).header()).css('background-color', 'transparent');
		}
	});
	table.buttons(['3-20']).trigger();
});
