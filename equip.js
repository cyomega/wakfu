let uits = {};
$.ajax({
	url: 'data/texts.txt',
	type: 'get',
	dataType: 'json',
	async: false,
	success: function(data) {
		uits = data[lang];
	}
});
$(document).ready(function() {
	function levelPane() {
		let options = [];
		for (let i = 0; i < level.length; ++i) {
			let min = level[i] != 20 ? level[i] - 15 : 0;
			options.push({
				label: level[i],
				value: function (rowData) {
					return rowData[4] <= level[i] && rowData[4] > min;
				}
			});
		}
		return options;
	}
	function masteryPane() {
		let options = [{
			label: '🛇 ' + uits.secMastery,
			value: function (rowData) {
				return rowData.total == rowData[21];
			}
		}];
		for (let i = 0; i < uits.masteryLong.length; ++i) {
			options.push({
				label: '🛇 ' + uits.masteryLong[i],
				value: function (rowData) {
					return rowData[(i + 22)] <= 0;
				}
			});
		}
		return options;
	}
	function levelButton() {
		let options = [];
		let spacerCount = 3;
		for (let i = 0; i < level.length; ++i) {
			options.push({
				text: level[i],
				className: 'levelBtn',
				action: function() {
					this.disable();
					this.processing(true);
					setTimeout(() => {
						$.get('data/' + level[i] + '.txt', function(data) {
							table.rows.add(JSON.parse(data)).every(function() {
								newData(this.data());
							})
							.searchPanes.rebuildPane().draw();
						});
						this.processing(false);
					}, 0);
				}
			});
			if (i == spacerCount || level[i] == 20) {
				spacerCount += 4;
				options.push({extend: 'spacer'});
			}
		}
		options.push({
			text: 'ALL',
			className: 'levelBtn',
			action: function() {
				table.buttons('.levelBtn').disable();
				this.processing(true);
				setTimeout(() => {
					table.clear();
					let result = [];
					for (let lv of level) {
						$.ajax({
							url: 'data/' + lv + '.txt',
							type: 'get',
							dataType: 'json',
							async: false,
							success: data => result.push(...data)
						});
					}
					table.rows.add(result).every(function() {
						newData(this.data());
					}).searchPanes.rebuildPane().draw();
					this.processing(false);
					$('.dt-button-background').trigger('click');
				}, 0);
			}
		});
		return options;
	}
	function visableButton() {
		return [
			{
				text: uits.secMastery,
				action: function (e, dt) {
					dt.columns([-6, -7, -8, -9, -10, -11]).visible(!dt.column(-6).visible());
					this.active(!this.active());
				}
			},
			{
				text: uits.visable[1],
				action: function (e, dt) {
					dt.columns([-4, -5]).visible(!dt.column(-4).visible());
					this.active(!this.active());
				}
			},
			{
				text: uits.visable[2],
				action: function (e, dt) {
					dt.columns([-1, -2, -3]).visible(!dt.column(-1).visible());
					this.active(!this.active());
				}
			}
		];
	}
	function setRandomButton() {
		let options = [
			{
				extend: 'spacer',
				text: uits.setStatAchieve
			},
		];
		let buttonText1 = [uits.title[4], uits.title[5], uits.title[6], uits.title[7], uits.masteryLong[2], uits.title[13]];
		for (let i = 0; i < buttonText1.length; ++i) {
			let j = i < 4 ? 1 : 10;
			options.push({
				text: buttonText1[i] + ': ' + statRequire[i],
				className: 'buildBtn',
				action: function () {
					let k = setOption[4] ? -1 : 1;
					if (setOption[3] || statRequire[i] == -1 || (k == -1 && statRequire[i] == 0))
						statRequire[i] += k;
					else
						statRequire[i] += j * k;
					if (statRequire[i] > (8 * j))
						statRequire[i] = -1;
					else if (statRequire[i] < -1)
						statRequire[i] = 8 * j;
					if (statRequire[i] == -1)
						this.text(buttonText1[i] + ': ' + '--');
					else
						this.text(buttonText1[i] + ': ' + statRequire[i]);
				}
			});
		}
		options.push(
			{
				extend: 'spacer',
				style: 'buildSpacer'
			},
			{
				text: '+10 ➜ +1',
				action: function () {
					setOption[3] = !setOption[3];
					this.active(!this.active());
				}
			},
			{
				text: '<small>➕</small> ➜ <small>➖</small>',
				action: function () {
					setOption[4] = !setOption[4];
					this.active(!this.active());
				}
			},
			{
				extend: 'spacer',
				text: uits.setStatScore
			}
		);
		let buttonText2 = [uits.title[9], uits.title[10], uits.title[11], uits.title[12], uits.mastery, uits.res];
		for (let i = 0; i < buttonText2.length; ++i) {
			options.push({
				text: buttonText2[i],
				className: 'buildBtn',
				action: function () {
					statImportant[i] = !statImportant[i];
					this.active(!this.active());
				}
			});
		}
		options.push(
			{
				extend: 'spacer',
				text: uits.setRandomOption
			},
		);
		let buttonText3 = [uits.type[11], uits.setDepth, uits.setRange];
		for (let i = 0; i < buttonText3.length; ++i) {
			options.push({
				text: buttonText3[i],
				action: function () {
					setOption[i] = !setOption[i];
					this.active(!this.active());
				}
			});
		}
		options.push('selectNone');
		return options;
	}
	function newData(data) {
		let _2ndMastery = '';
		let totalMastery = Number(data[21]);
		let i = uits.masteryShort.length;
		while (i--) {
			if (data[(i + 22)] > 0) {
				_2ndMastery = uits.masteryShort[i] + _2ndMastery;
				totalMastery += Number(data[(i + 22)]);
			}
		}
		data.name = data[0][lang];
		if (lang2 != 'none')
			data[1] = data[0][lang2];
		data.mastery = _2ndMastery;
		data.score = (totalMastery/30 + Number(data[17]) / 6.25).toFixed(1);
		data.total = totalMastery;
		data.type = uits.type[data[3]];
		data.rarity = uits.rarity[data[5]];
	}
	function equipReference() {
		$('.dtsp-searchPane:eq(0) .clearButton').click();
		let set = '';
		let equipExclude = table.rows({selected: true}).data();
		if (equipExclude.length == 0)
			table.search('');
		else {
			let i = equipExclude.length;
			while (i--) {
				set += equipExclude[i][2] + '|';
				if (equipExclude[i][2] > 26574 && equipExclude[i][2] < 26579)
					set += (equipExclude[i][2] - 81) + '|';
			}
			set = set.replace(/.$/, '');
			table.search('^((?!' + set + ').)*$');
		}
		let dmgModifier = [];
		for (let i = uits.masteryLong.length; i >= 0; i--)
			dmgModifier[i] = Number(!$('.dtsp-searchPane:eq(3) table tbody tr:eq(' + i + ')').hasClass('selected'));
		if (dmgModifier[0] == 0)
			dmgModifier.fill(0);
		const d = table.rows({search: 'applied'}).data();
		let data = [];
		for (let i = d.length - 1; i >= 0; i--) {
			let modifiedDmg = Number(d[i][21]);
			for (let j = uits.masteryLong.length; j > 0; j--)
				modifiedDmg += dmgModifier[j] * Number(d[i][j + 21]);
			data[i] = {
				name: d[i][0].en,
				id: d[i][2],
				type: d[i][3],
				rarity: d[i][5],
				ap: d[i][6],
				mp: d[i][7],
				wp: d[i][8],
				range: d[i][9],
				hp: d[i][11],
				lock: d[i][12],
				dodge: d[i][13],
				ini: d[i][14],
				cri: d[i][15],
				block: d[i][16],
				dmg: modifiedDmg,
				res: d[i][17]
			};
		}
		let statName = ['ap', 'mp', 'wp', 'range', 'cri', 'block'];
		let statRequireObj = {};
		for (let i in statRequire) {
			let j = statName[i];
			statRequireObj[j] = statRequire[i];
		}
		statName = ['hp', 'lock', 'dodge', 'ini', 'dmg', 'res'];
		let statWeight = {hp: 1/80, lock: 1/60, dodge: 1/60, ini: 1/40, dmg: 1/30, res: 1/6.25};
		for (let i in statImportant) {
			let j = statName[i];
			statWeight[j] = Number(statWeight[j]) * Number(statImportant[i]);
		}
		let randomCount = 100000;
		let equipQuantity = setOption[2] ? 20 : 10;
		autoSets(data, statRequireObj, statWeight, setOption[0], randomCount, equipQuantity);
	}
	function autoSets(data, statRequire, statWeight, twoHandWeapon, randomCount, equipQuantity) {
		function achieveCheck(stat, statMin) {
			let achieve = 0;
			let i = stat.length;
			while (i--) {
				if (statMin[i] != -1)
					achieve += Math.min(stat[i], statMin[i]);
			}
			return achieve == goal ? 1 : achieve / goal;
		}
		let equip = [[], [], [], [], [], [], [], [], [], [], [], [], []];
		let statMin = [];
		let statName = ['ap', 'mp', 'wp', 'range', 'cri', 'block'];
		const statModifier = [10, 5, 4, 3, 1, 1];
		for (let i in statName) {
			let j = statName[i];
			statMin[i] = statRequire[j] == -1 ? -1 : Number(statRequire[j] * statModifier[i]);
		}
		const goal = Number(statMin.reduce((a, c) => {
			let x = a == -1 ? 0 : a;
			let y = c == -1 ? 0 : c;
			return x + y;
		}));
		statName = ['hp', 'lock', 'dodge', 'ini', 'dmg', 'res'];
		for (let i = data.length - 1; i >= 0; i--) {
			let score = 0;
			for (let j of statName)
				score += Number(data[i][j] * statWeight[j]);
			equip[data[i].type].push([
				Number(data[i].id),
				Number(data[i].rarity),
				Number(data[i].ap * statModifier[0]),
				Number(data[i].mp * statModifier[1]),
				Number(data[i].wp * statModifier[2]),
				Number(data[i].range * statModifier[3]),
				Number(data[i].cri),
				Number(data[i].block),
				Number(score.toFixed(1)),
				data[i].name
			]);
		}
		for (let i in equip)
			equip[i].sort((a, b) => b[8] - a[8] || a[1] - b[1]);
		let type = [];
		for (let i = 0; i < 9; i++)
			type[i] = equip[i];
		type[9] = equip[7];
		if (twoHandWeapon == false) {
			type[10] = equip[9];
			type[11] = equip[10];
		}
		else
			type[10] = equip[11];
		type.push(equip[12]);
		let typeWeightZero = [];
		for (let i = type.length - 1; i >= 0; i--)
			typeWeightZero.push([]);
		for (let i = type.length - 1; i >= 0; i--) {
			if (type[i].length == 0)
				type[i].push([99999, 7, 0, 0, 0, 0, 0, 0, 0, 'cyz']);
			let weight = Math.min(type[i].length, 573);
			let count = 0;
			for (let j = 0; j < weight; j++) {
				let enlist = true;
				let noCount = true;
				if (type[i][j][1] > 1) {
					noCount = false;
					for (let k = 0; k < j; k++) {
						if (type[i][k][1] < 2)
							continue;
						if (i != 9) {
							if (statMin.every((e, n) => e == -1 || type[i][k][n + 2] >= type[i][j][n + 2])) {
								enlist = false;
								break;
							}
						}
						else if (type[i][k][9] == type[i][j][9]) {
							enlist = false;
							break;
						}
					}
				}
				if (enlist == true) {
					typeWeightZero[i].push(j);
					if (noCount == false)	
						count++;
					if ((i != 9 && count >= equipQuantity) || (i == 9 && count >= equipQuantity * 2))
						break;
				}
			}
		}
		if (typeWeightZero[9].length < 2)
			return builderEnd(false);
		let typeWeight = JSON.parse(JSON.stringify(typeWeightZero));
		let setSuccess = [];
		let typeOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		if (twoHandWeapon == false) {
			typeOrder.push(11);
			type[10].some((stat, index) => {
				if (stat[0] == 26593 && !typeWeightZero[10].includes(index)) {
					typeWeightZero[10].push(index);
					return true;
				}
			});
		}
		typeOrder.push(typeOrder.length);
		function solverWorker(workerCount, lastScore, lastLength) {
			if (workerCount > worker.length)
				workerCount = worker.length;
			for (let i = workerCount - 1; i >= 0; i--) {
				worker[i].postMessage([type, typeOrder, typeWeight, typeWeightZero, setSuccess, goal, statMin, randomCount]);
				worker[i].onmessage = e => {
					let d = e.data;
					for (let i = d.length - 1; i >= 0; i--)
						if (!setSuccess.some(x => d[i].id.every(y => x.id.some(z => y == z))))
							setSuccess.push(d[i]);
					workerCount--;
					if (workerCount == 0) {
						setSuccess.sort((a, b) => b.score - a.score).splice(50);
						let currentScore = setSuccess.length ? setSuccess[0].score + setSuccess[setSuccess.length - 1].score : 0;
						if ((currentScore == lastScore && setSuccess.length == lastLength) || !repeatCount) {
							alterSets();
						}
						else {
							repeatCount--;
							randomCount = setOption[1] ? 100000 : 30000;
							solverWorker(6, currentScore, setSuccess.length);
						}
					}
				};
			}
			if (worker.length == 2) {
				for (let i = 2; i < 6; i++)
					worker[i] = new Worker('solver.js');
			}
		}
		let repeatCount = 5;
		if (!worker.length) {
			for (let i = 0; i < 2; i++)
				worker[i] = new Worker('solver.js');
		}
		solverWorker(2);
		function builderEnd(result) {
			table.button(4).processing(false);
			if (setRandomClick == 0) {
				table.button(4).trigger();
				setRandomClick = 1;
			}
			if (result) {
				table.buttons(['5', '6', '7', '8']).enable();
				setResultAlter = 0;
				table.button(8).text(setResultAlter + 1);
				table.button(5).trigger();
			}
			else {
				table.buttons(['5', '6', '7', '8']).disable();
				table.button(4).text(uits.setFailed);
				table.search('').draw();
			}
		}
		function alterSets() {
			if (setSuccess.length == 0)
				return builderEnd(false);
			let setAlter = [[setSuccess[0]]];
			for (let n = 1; n < setSuccess.length; n++) {
				if(setSuccess[n].id[10] > 26493 && setSuccess[n].id[10] < 26498)
					type[9].some((s, i) => {
						if (s[0] == setSuccess[n].id[9]) {
							setSuccess[n].index[9] = i;
							return true;
						}
					});
				let unique = [];
				for (let i = type.length - 1; i >= 0; i--) {
					let j = setSuccess[n].index[i];
					if (type[i][j][1] < 2)
						unique.push(type[i][j][0]);
				}
				if (!setAlter.some((s, i) => {
					if (unique.every(u => s[0].id.some(id => u == id))) {
						setAlter[i].push(setSuccess[n]);
						return true;
					}
				}))
					setAlter.push([setSuccess[n]]);
			}
			setAlter.splice(5);
			for (let n = 0; n < setAlter.length; n++) {
				for (let m = 0; m < 10; m++) {
					let sAnm = setAlter[n][m];
					sAnm.index.every((j, i) => {
						if (type[i][j][1] < 2)
							return true;
						for (let p = j + 1; p < type[i].length; p++) {
							if (type[i][p][1] < 2 || (type[i][p][9] == type[i][j][9] && type[i][p][8] == type[i][j][8] && type[i][p][1] == type[i][j][1]))
								continue;
							let tempStat = sAnm.stat.concat();
							for (let a = statMin.length - 1; a >= 0; a--) {
								let b = a + 2;
								tempStat[a] += type[i][p][b] - type[i][j][b];
							}
							if (achieveCheck(tempStat, statMin) != 1)
								continue;
							let setTemp = {id:sAnm.id.concat(), score:sAnm.score, index:sAnm.index.concat(), stat:tempStat.concat()};
							setTemp.index[i] = p;
							if ((i == 7 || i == 9) && type[7][setTemp.index[7]][9] == type[9][setTemp.index[9]][9])
								continue;
							setTemp.id[i] = type[i][p][0];
							if (setAlter[n].some(x => setTemp.id.every(y => x.id.some(z => y == z))))
								continue;
							setTemp.score = (Number(sAnm.score) + type[i][p][8] - type[i][j][8]).toFixed(1);
							setAlter[n].push(setTemp);
							break;
						}
						return true;
					});
					setAlter[n].sort((a, b) => b.score - a.score).splice(10);
				}
			}
			setResult = [];
			for (i = 0; i < setAlter.length; i++) {
				setResult.push([]);
				for (j = 0; j < setAlter[i].length; j++) {
					let set = '';
					for (x of setAlter[i][j].id)
						set += x + '|';
					set = set.replace(/.$/, '');
					setResult[i].push({"id":set, "score":setAlter[i][j].score});
				}
			}
			builderEnd(true);
		}
	}
	function setResultShow(i, j) {
		table.search('\\D(' + setResult[i][j].id + ')\\D').draw();
		table.button(4).text('(' + (setResultIndex + 1) + '/' + setResult[i].length + ') ' + uits.setScore + setResult[i][j].score);
		table.button(8).text(Number(setResultAlter + 1) + '/' + setResult.length);
	}
	const rarityColor = ['#D7BDE2', '#F2D7D5', '#AED6F1', '#F9E79F', '#E59866', '#ABEBC6', '#FFFFFF', '#D3D3D3'];
	const level = [245, 230, 215, 200, 185, 170, 155, 140, 125, 110, 95, 80, 65, 50, 35, 20];
	const langReverse = ['es', 'pt', 'fr'];
	tableText.buttons.selectNone = uits.setSelectNone;
	let linkType = [];
	for (let i = 0; i < 8; i++)
		linkType.push(uits.linkParm[2]);
	linkType.push(uits.linkParm[3]);
	for (let i = 0; i < 3; i++)
		linkType.push(uits.linkParm[4]);
	linkType.push(uits.linkParm[5]);
	let statImportant = [0, 0, 0, 0, 0, 0];
	let statRequire = [5, 2, 8, 8, 80, 80];
	let setOption = [false, false, false, false, false];
	//twohand depth range tweak decrease
	let setRandomClick = 0;
	let setResult = [];
	let setResultIndex = 0;
	let setResultAlter = 0;
	let titleMastery = [];
	let titleRes = [];
	let worker = [];
	for (let i = 0; i < 6; i++) {
		if (langReverse.includes(lang))
			titleMastery.push(uits.mastery + '<br>' + uits.masteryLong[i]);
		else
			titleMastery.push(uits.masteryLong[i] + '<br>' + uits.mastery);
	}
	for (let i = 2; i < 4; i++) {
		if (langReverse.includes(lang))
			titleRes.push(uits.mastery + '<br>' + uits.masteryLong[i]);
		else
			titleRes.push(uits.masteryLong[i] + '<br>' + uits.mastery);
	}
	$.fn.dataTable.enum(uits.rarity);
	$.fn.dataTable.enum(uits.type);
	const table = $('#equipTable').DataTable({
		columns: [
			{title: uits.title[0], data: 'name'},
			null,	//lang2
			null,	//id
			{title: uits.title[1], data: 'type'},
			{title: uits.title[2]},
			{title: uits.title[3], data: 'rarity'},	//5
			{title: uits.title[4]},
			{title: uits.title[5]},
			{title: uits.title[6]},
			{title: uits.title[7]},
			{title: uits.title[8]},			//10
			{title: uits.title[9]},
			{title: uits.title[10]},
			{title: uits.title[11]},
			{title: uits.title[12]},
			{title: uits.masteryLong[2]},		//15
			{title: uits.title[13]},
			{title: uits.title[14], data: 'mastery'},
			{title: uits.title[15], data: 'score'},
			{title: uits.title[16], data: 'total'},
			{title: uits.title[17], data: 17},	//20
			{title: uits.title[18], data: 18},	//-15
			{title: uits.title[19], data: 19},
			{title: uits.title[20], data: 20},
			{title: uits.title[21], data: 21},
			{title: titleMastery[0], data: 22},	//25
			{title: titleMastery[1], data: 23},	//-10
			{title: titleMastery[2], data: 24},
			{title: titleMastery[3], data: 25},
			{title: titleMastery[4], data: 26},
			{title: titleMastery[5], data: 27},	//30
			{title: titleRes[0], data: 28},		//-5
			{title: titleRes[1], data: 29},
			{title: uits.title[22], data: 30},
			{title: uits.title[23], data: 31},
			{title: uits.title[24], data: 32}
		],
		pageLength: 15,
		lengthMenu: [15, 25, 50, 100],
		fixedColumns: true,
		scrollX: true,
		scrollCollapse: true,
		deferRender: true,
		search: {regex: true},
		select: true,
		ordering: {indicators: false},
		order: [[3, 'asc'], [18, 'desc'], [19, 'desc']],
		layout: {
			top3Start: [{div: {html: '<a style="margin-left: max(0px, min(460px, calc(50vw - 650px)))"></a>'}}, 'searchPanes'],
			top2Start: [{div: {html: '<a style="margin-left: max(0px, min(460px, calc(50vw - 650px)))"></a>'}}, 'buttons'],
			topStart: {div: {html: '<span style="color: white; font-size: 15px; font-weight: bold; margin-left: max(10px, min(480px, calc(50vw - 640px)))">' + uits.scoreDes + '</span>'}},
			topEnd: ['pageLength', 'search', {div: {html: '<a style="margin-right: max(10px, min(480px, calc(50vw - 640px)))"></a>'}}],
			bottom: 'paging',
			bottomStart: null,
			bottomEnd: null
		},
		select: {
			style: 'multi',
			selector: 'td:not(:first-child)'
		},
		searchPanes: {
			columns: [3, 4, 5, 17, 23],
			orderable: false,
			layout: 'columns-5',
			dtOpts: {select: {style: 'multi'}},
		},
		buttons: [
			{
				extend: 'collection',
				collectionLayout: 'columns levelCollection',
				text: uits.title[2],
				className: 'levelBtn',
				buttons: levelButton()
			},
			{
				extend: 'collection',
				collectionLayout: 'visableCollection',
				text: uits.visable[0],
				buttons: visableButton()
			},
			{
				extend: 'spacer',
				style: 'bar'
			},
			{
				text: uits.setRandom,
				collectionLayout: 'columns buildCollection',
				action: function() {
					table.button(4).processing(true);
					setTimeout(() => equipReference(), 0);
				},
				split: setRandomButton()
			},
			{
				text: uits.setManual,
				action: function (e) {
					e.stopPropagation();
					this.popover(
						'<div><br>' + uits.setCondition + '<br><br>' + uits.setExclude + '</div>',
						{
							background: false,
							closeButton: false,
							popoverTitle: uits.setManual
						}
					);
				}
			},
			{
				text: '|◀',
				className: 'result-alter',
				action: function () {
					setResultIndex = 0;
					setResultShow(setResultAlter, setResultIndex);
				}
			},
			{
				text: '◀',
				className: 'result-alter',
				action: function () {
					setResultIndex--;
					if (setResultIndex < 0)
						setResultIndex = setResult[setResultAlter].length - 1;
					setResultShow(setResultAlter, setResultIndex);
				}
			},
			{
				text: '▶',
				className: 'result-alter',
				action: function () {
					setResultIndex++;
					if (setResultIndex >= setResult[setResultAlter].length)
						setResultIndex = 0;
					setResultShow(setResultAlter, setResultIndex);
				}
			},
			{
				className: 'result-alter',
				action: function () {
					setResultAlter++;
					setResultIndex = 0;
					if (setResultAlter >= setResult.length)
						setResultAlter = 0;
					setResultShow(setResultAlter, setResultIndex);
				}
			},
			{
				text: uits.selectAllSearch,
				action: function (e, dt) {
					dt.rows({search: 'applied'}).select();
				}
			},
			{
				extend: 'spacer',
				style: 'bar'
			},
			{
				text: uits.copyTable,
				action: function() {
					const d = table.rows({search: 'applied'}).data();
					let text = '<table><tr>';
					for (let i = 0; i < 13; i++)
						text += '<th>' + uits.title[i] + '</th>';
					text += '<th>' + uits.masteryLong[2] + '</th>';
					for (let i = 13; i < 22; i++)
						text += '<th>' + uits.title[i] + '</th>';
					for (let i = 0; i < uits.masteryLong.length; i++) {
						if (langReverse.includes(lang))
							text += '<th>' + uits.mastery + '<br>' + uits.masteryLong[i] + '</th>';
						else
							text += '<th>' + uits.masteryLong[i] + '<br>' + uits.mastery + '</th>';
					}
					text += '<th>' + uits.masteryLong[2] + '<br>' + uits.res + '</th>'
						+ '<th>' + uits.masteryLong[3] + '<br>' + uits.res + '</th>'
						+ '<th>' + uits.title[22] + '</th>'
						+ '<th>' + uits.title[23] + '</th>'
						+ '<th>' + uits.title[24] + '</th>'
						+ '</tr>';
					for (let i = 0; i < d.length; i++) {
						text += '<tr><td style="background-color:' + rarityColor[d[i][5]] + '"><a href="https://www.wakfu.com/' + uits.linkParm[0] + '/mmorpg/' + uits.linkParm[1] + '/' + linkType[d[i][3]] + '/' + d[i][2] + '">' + d[i].name + '</a></td>'
							+ '<td align="center">' + d[i].type + '</td>'
							+ '<td align="center">' + d[i][4] + '</td>'
							+ '<td align="center">' + d[i].rarity + '</td>';
						for (let j = 6; j < 17; j++)
							text += '<td align="center">' + d[i][j] + '</td>';
						text += '<td align="center">' + d[i].mastery + '</td>'
							+ '<td align="center">' + d[i].score + '</td>'
							+ '<td align="center">' + d[i].total + '</td>';
						for (let j = 17; j < 33; j++)
							text += '<td align="center">' + d[i][j] + '</td>';
						text += '</tr>';
					}
					text += '</table>';
					const type = "text/html";
					const blob = new Blob([text], { type });
					const data = [new ClipboardItem({ [type]: blob })];
					navigator.clipboard.write(data);
				}
			},
			{
				extend: 'spacer'
			}
		],
		columnDefs: [
			{
				targets: 3,
				orderSequence: ['asc', 'desc'],
				searchPanes: {dtOpts: {select: {style: 'os'}}}
			},
			{
				targets: [18, 20],
				render: $.fn.dataTable.render.number('', '.', 1, '')
			},
			{
				targets: [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35],
				render: $.fn.dataTable.render.number('', '.', 0, ''),
				type: $.fn.dataTable.absoluteOrderNumber([{value: '', position: 'bottom'}])
			},
			{
				targets: [1, 2, 5, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11],
				visible: false
			},
			{
				targets: 4,
				searchPanes: {
					dtOpts: {order: [0, 'desc']},
					options: levelPane()
				}
			},
			{
				targets: 17,
				searchPanes: {
					header: uits.positive,
					combiner: 'and',
					options: masteryPane()
				}
			},
			{
				targets: 23,
				searchPanes: {
					header: uits.eleNum,
					emptyMessage: '0'
				}
			},
			{
				targets: '_all',
				orderSequence: ['desc', 'asc'],
				className: 'dt-left'
			},
		],
		language: tableText,
		rowCallback: function(row, data) {
			$('td:eq(0)', row).css('background-color', function() {
				return rarityColor[data[5]] + 'EE';
			});
			$('td:eq(0)', row).html(function() {
				let name = '<a href="https://www.wakfu.com/' + uits.linkParm[0] + '/mmorpg/' + uits.linkParm[1] + '/' + linkType[data[3]] + '/' + data[2] + '" target="_blank">' + data.name + '</a>';
				return lang2 == 'none' ? name : name + '<br>' + data[1];
			});
		},
		headerCallback: function (thead, data, start, end, display) {
			let api = this.api();
			let intVal = function (i) {
				return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
			};
			let title;
			for (let i = 6; i < 21; i++) {
				if (i == 17 || i == 18)
					continue;
				let total = api.column(i, { search: 'applied' }).data().reduce(function (a, b) {
					return intVal(a) + intVal(b);
				}, 0);
				if (i == 19 || i == 20)
					total = total.toFixed(1);
				if (i < 15)
					title = uits.title[i - 2];
				else if (i == 15)
					title = uits.masteryLong[2];
				else if (i > 15)
					title = uits.title[i - 3];
				$(api.column(i).header()).html(title + '<br>' + total);
			}
		},
	});
	$('.wide-table').css({'margin-left': 'max(-480px, calc(50% - 50vw + 15px))', 'margin-right': 'max(-480px, calc(50% - 50vw + 15px))'});
	table.buttons(['1-0', '3-3', '3-4', '3-5', '3-6', '3-15', '3-16']).trigger();
	table.buttons(['5', '6', '7', '8']).disable();
});
