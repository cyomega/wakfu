function solver(type, typeOrder, typeWeight, typeWeightZero, setSuccess, goal, statMin, randomCount) {
	function achieveCheck(stat, statMin) {
		let achieve = 0;
		let i = stat.length;
		while (i--) {
			if (statMin[i] != -1)
				achieve += Math.min(stat[i], statMin[i]);
		}
		return achieve == goal ? 1 : achieve / goal;
	}
	function cloneArr(arr) {
		let clone = [];
		for (let i = arr.length - 1; i >= 0; i--)
			clone[i] = arr[i].concat();
		return clone;
	}
	let failCount = 0;
	let leastScore = 0;
	let gradient = randomCount * 5;
	sampling: while (randomCount--) {
		let relic = 0;
		let epic = 0;
		let currentStat = [0, 0, 0, 0, 0, 0];
		let currentIndex = [];
		let currentID = [];
		let currentScore = 0;
		for (let i = type.length - 1; i >= 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[typeOrder[i], typeOrder[j]] = [typeOrder[j], typeOrder[i]];
		}
		for (let m = type.length - 1; m >= 0; m--) {
			let i = typeOrder[m];
			let j;
			let typeWeightTemp = [];
			for (let n = 0; n < 999; n++) {
				let k = Math.floor(Math.random() * typeWeight[i].length);
				j = typeWeight[i][k];
				if (!typeWeightTemp.includes(j))
					typeWeightTemp.push(j);
				else if (typeWeightTemp.length == typeWeightZero[i].length)
					break;
				if (
					(type[i][j][1] == 0 && relic > 0)
					|| (type[i][j][1] == 1 && epic > 0)
					|| (i == 7 && j == currentIndex[9])
					|| (i == 9 && j == currentIndex[7])
				)
					continue;
				break;
			}
			currentIndex[i] = j;
			currentID[i] = type[i][j][0];
			if (type[i][j][1] == 0)
				relic++;
			if (type[i][j][1] == 1 || (currentID[i] > 26493 && currentID[i] < 26498))
				epic++;
			if (relic > 1 || epic > 1)
				continue sampling;
			currentScore += type[i][j][8];
			for (let m = statMin.length - 1; m >= 0; m--)
				currentStat[m] += type[i][j][m + 2];
		}
		let achieveRate = achieveCheck(currentStat, statMin);
		if (achieveRate == 1) {
			for (let i = 0; i < type.length; i++) {
				if (type[i][currentIndex[i]][1] < 2)
					continue;
				for (let j of typeWeightZero[i]) {
					if (j == currentIndex[i])
						break;
					if (
						type[i][j][1] < 2
						|| (i == 7 && j == currentIndex[9])
						|| (i == 9 && j == currentIndex[7])
					)
						continue;
					let tempStat = currentStat.concat();
					for (let m = 0; m < statMin.length; m++)
						tempStat[m] += type[i][j][m + 2] - type[i][currentIndex[i]][m + 2];
					if (achieveCheck(tempStat, statMin) == 1) {
						currentID[i] = type[i][j][0];
						currentScore += type[i][j][8] - type[i][currentIndex[i]][8];
						currentStat = tempStat.concat();
						currentIndex[i] = j;
						break;
					}
				}
			}
			if (currentID[10] > 26493 && currentID[10] < 26498) {
				currentStat.every((e, i) => currentStat[i] -= type[9][currentIndex[9]][i + 2]);
				if (achieveCheck(currentStat, statMin) < 1)
					continue;
				currentScore -= type[9][currentIndex[9]][8];
				currentID[9] = currentID[10] + 81;
			}
			typeWeight = cloneArr(typeWeightZero);
			for (let n = setSuccess.length >> 1; n > 0; n--) {
				let r = Math.floor(Math.random() * setSuccess.length);
				for (let i = type.length - 1; i >= 0; i--)
					typeWeight[i].push(setSuccess[r].index[i]);
			}
			if (
				currentScore < leastScore
				|| currentID[7] == currentID[9]
				|| setSuccess.some(x => currentID.every(y => x.id.some(z => y == z)))
			)
				continue;
			setSuccess.push({id:currentID, score:currentScore.toFixed(1), index:currentIndex, stat:currentStat});
			failCount = 0;
			if (setSuccess.length > 69) {
				setSuccess.sort((a, b) => b.score - a.score).splice(50);
				leastScore = setSuccess[49].score - 0.1;
			}
		}
		else if (achieveRate > 0.9 - randomCount / gradient) {
			failCount++;
			if (failCount > 99) {
				typeWeight = cloneArr(typeWeightZero);
				failCount = 0;
			}
			else {
				for (let i = type.length - 1; i >= 0; i--)
					typeWeight[i].push(currentIndex[i]);
			}
		}
	}
	return setSuccess;
}
onmessage = e => postMessage(solver(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5], e.data[6], e.data[7]));
