$(document).ready(function() {
	$.get('data/subli.txt', function(data) {
		if (lang == 'tw')
			table.rows.add(JSON.parse(data)).draw();
		else if (lang == 'cn') {
			$.getScript('https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js', function() {
				let converter = OpenCC.CustomConverter([
					['熱帶植物', '椰人'],
					['食人藤', '汉尼草'],
					['食人族', '汉尼芭']
				]);
				data = converter(data);
				converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
				data = converter(data);
				table.rows.add(JSON.parse(data)).draw();
			});
		}
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
				let k = j == 0 ? '\\d' : j.toString();
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
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><text y="19" font-size="20">📜</text></svg>',
		'<svg height="26" width="28" xmlns="http://www.w3.org/2000/svg"><text y="19" font-size="20">📚</text></svg>'
	];
	const socketsCombo = ['\\d', '\\d', '\\d', '\\d'];
	const socketsComboName = [sockets[0], sockets[0], sockets[0], sockets[0]];
	const title = {tw:'名稱', cn:'名称'};
	const table = $('#tableArray').DataTable({
		columns: [
			{title: title[lang], data: null, width: '140px'},
			{title: '附魔', data: null, width: '10px'},
			{title: '效果', data: 5, width: '700px'},
			{title: '掉落', data: 6},
			{visible: false, data: 3}
		],
		autoWidth: false,
		deferRender: true,
		search: {regex: true},
		dom: 'Blfrtp',
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
				collectionLayout: 'columns socketsCollection',
				buttons: socketsComboBtn()
			},
			{
				text: sockets[8],
				action: function (e, dt) {
					dt.column(4).search('').draw();
				}
			},
			{
				extend: 'spacer'
			}
		],
		rowCallback: function(row, data) {
			$('td:eq(0)', row).html(function() {
				return '<div style="position: relative; top: 5px; height: 45px">' + data[0] + ' ' + data[2] + '<br>' + data[1] + '</div>';
			});
			$('td:eq(1)', row).html(function() {
				if (data[3].charAt(0) < 4)
					return sockets[data[3].charAt(0)] + sockets[data[3].charAt(1)] + sockets[data[3].charAt(2)] + '<br>上限：' + data[4];
				else
					return sockets[data[3].charAt(0)];
			});
		}
	});
	table.buttons(['3-20']).trigger();
});