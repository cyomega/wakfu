function solver(type, typeOrder, typeWeight, typeWeightZero, setSuccess, goal, statMin, randomCount) {
	if (type == 0)
		type = typeWorker;
	else
		typeWorker = type;
	const typeID = type.id;
	const typeRarity = type.rarity;
	const typeStats = type.stats;
	const typeScore = type.score;
	const typeLen = typeID.length;
	const statLen = statMin.length;
	function achieveCheck(stat, statMin) {
		let achieve = 0;
		for (let i = statLen; i--;) {
			if (statMin[i] != -1)
				achieve += Math.min(stat[i], statMin[i]);
		}
		return achieve == goal ? 1 : achieve / goal;
	}
	function cloneArr(arr) {
		let clone = [];
		for (let i = arr.length; i--;)
			clone[i] = arr[i].slice();
		return clone;
	}
	const gradient = randomCount * 5;
	let failCount = 0;
	let leastScore = 0;
	let relic = 0;
	let epic = 0;
	let currentIndex = new Int32Array(typeLen);
	let currentID = new Int32Array(typeLen);
	let currentStat = new Int32Array(statLen);
	let currentScore = 0;
	let tempStat = new Int32Array(statLen);
	sampling: while (randomCount--) {
		relic = 0;
		epic = 0;
		currentStat.fill(0);
		currentScore = 0;
		for (let i = typeLen; i--;) {
			const j = (Math.random() * (i + 1)) | 0;
			const temp = typeOrder[i];
			typeOrder[i] = typeOrder[j];
			typeOrder[j] = temp;
		}
		for (let m = typeLen; m--;) {
			const i = typeOrder[m];
			const weight = typeWeight[i];
			const weightLen = weight.length;
			const rarity = typeRarity[i]
			let j;
			let retries = 313;
			while (retries--) {
				j = weight[Math.random() * weightLen | 0];
				if (
					(rarity[j] == 0 && relic > 0)
					|| (rarity[j] == 1 && epic > 0)
					|| (i == 7 && j == currentIndex[9])
					|| (i == 9 && j == currentIndex[7])
				)
					continue;
				break;
			}
			if (retries == 0)
				continue sampling;
			currentIndex[i] = j;
			currentID[i] = typeID[i][j];
			switch (rarity[j]) {
				case 0:
					relic++;
					if (currentID[i] > 26493 && currentID[i] < 26498)
						epic++;
					break;
				case 1:
					epic++;
			}
			if (relic > 1 || epic > 1)
				continue sampling;
			currentScore += typeScore[i][j];
			const stats = typeStats[i][j];
			for (let m = statLen; m--;)
				currentStat[m] += stats[m];
		}
		const achieveRate = achieveCheck(currentStat, statMin);
		if (achieveRate == 1) {
			for (let i = typeLen; i--;) {
				const rarity = typeRarity[i];
				const stats = typeStats[i];
				const weightZero = typeWeightZero[i];
				const weightZeroLen = weightZero.length;
				const k = currentIndex[i];
				if (rarity[k] < 2)
					continue;
				for (let m = 0; m < weightZeroLen; m++) {
					const j = weightZero[m];
					if (j == k)
						break;
					if (
						rarity[j] < 2
						|| (i == 7 && j == currentIndex[9])
						|| (i == 9 && j == currentIndex[7])
					)
						continue;
					tempStat = currentStat.slice();
					const statsSub = stats[j];
					const statsCurrent = stats[k];
					for (let n = statLen; n--;)
						tempStat[n] += statsSub[n] - statsCurrent[n];
					if (achieveCheck(tempStat, statMin) == 1) {
						const score = typeScore[i];
						currentID[i] = typeID[i][j];
						currentScore += score[j] - score[k];
						currentStat = tempStat.slice();
						currentIndex[i] = j;
						break;
					}
				}
			}
			if (currentID[10] > 26493 && currentID[10] < 26498) {
				const i9 = currentIndex[9];
				const s9 = typeStats[9][i9];
				for (let i = statLen; i--;)
					currentStat[i] -= s9[i];
				if (achieveCheck(currentStat, statMin) < 1)
					continue;
				currentScore -= typeScore[9][i9];
				currentID[9] = currentID[10] + 81;
			}
			typeWeight = cloneArr(typeWeightZero);
			const successLen = setSuccess.length;
			for (let n = successLen >> 1; n > 0; n--) {
				const r = Math.random() * successLen | 0;
				for (let i = typeLen; i--;)
					typeWeight[i].push(setSuccess[r].index[i]);
			}
			if (currentScore < leastScore || currentID[7] === currentID[9])
				continue;			
			for (let m = successLen; m--;) {
				const successID = setSuccess[m].id;
				let match = true;
				for (let i = typeLen; i--;) {
					let found = false;
					for (let n = successID.length; n--;) {
						if (currentID[i] == successID[n]) {
							found = true;
							break;
						}
					}
					if (!found) {
						match = false;
						break;
					}
				}
				if (match)
					continue sampling;
			}
			setSuccess.push({
				id: currentID.slice(),
				score: currentScore.toFixed(1),
				index: currentIndex.slice(),
				stat: currentStat.slice()
			});
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
				for (let i = typeLen; i--;)
					typeWeight[i].push(currentIndex[i]);
			}
		}
	}
	return setSuccess;
}
let typeWorker;
onmessage = e => postMessage(solver(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5], e.data[6], e.data[7]));
