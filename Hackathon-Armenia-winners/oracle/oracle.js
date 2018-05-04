var sum = (array) => {
        let total = 0;
        for (let i=0; i<array.length; i++) {
                total += array[i];
        }
        return total;
};

var getMean = (array) => {
        let arraySum = sum(array);
        return arraySum / array.length;
};

var getVariances = (user_bid, winners, mean) => {
        let results = [];
        for (i in user_bid) {
		if (winners.includes(parseInt(i))) {
			results.push(Math.abs(mean - user_bid[i]));
		} else {
			results.push(-1);
		}
        }
        return results;
};

var getPercentiles = (variences) => {
        let results = [];
        let sumOfVariences = sum(variences);
	if (sumOfVariences === 0) {
		return variences;
	}
        for (i in variences) {
                results.push(variences[i]/sumOfVariences);
        }
        return results;
};

var reverseVariences = (variences) => {
        let results = [];
        for (i in variences) {
		if (variences[i] === -1) {
			results.push(0);
		} else {
			results.push(1/(1 + variences[i]));
		}
        }
        return results;
};

var getCorrectAnswer = (source_data, user_data) => {
        let results = Array(source_data.length).fill(1);
	for (let i in source_data) {
		for (j in source_data) {
			if (j !== i && source_data[i] === source_data[j]) {
				results[i]++;
			}
		}
	}
        for (ud in user_data) {
		let found = false;
		for (sd in source_data) {
                        if (source_data[parseInt(sd)] === user_data[parseInt(ud)]) {
				found =	true;
                                results[source_data.indexOf(source_data[parseInt(sd)])]++;
				break;
                        }
		}
		if (!found) {
			source_data.push(user_data[ud]);
			results.push(1);
		}
	}
        let max_indexes = [], i = -1;
        while ((i = results.indexOf(Math.max(...results), i+1)) != -1){
                max_indexes.push(i);
        }
        let answers = [];
        max_indexes.forEach((i) => {
                answers.push(source_data[i]);
        });
        return {
		sourceData: source_data,
		maxIndexes: max_indexes
	};
};

var doValidation = (source_data, user_data, user_bid) => {
        let sd = source_data.map(Number);
        let ud = user_data.map(Number);
        let ub = user_bid.map(Number);
        let ans = getCorrectAnswer(sd, ud);
	let ca = ans.maxIndexes;
	let gd = ans.sourceData;
        if (ca.length === 0) {
                return {
                        errorCode: 1,
                        errorMessage: "No voted result matched with source data"
                };
        }
        var winners = [];
        for (ind in ca) {
                let res = [], i = -1;
                while ((i = ud.indexOf(gd[ca[parseInt(ind)]], i+1)) != -1){
                        res.push(i);
                }
                winners = winners.concat(res);
        }

        // Calculate prizes
        let mean = getMean(ub);
        let variences = getVariances(ub, winners, mean);
        // Reverse percentiles so users with less variances get higher prizes
        let reversedVariences = reverseVariences(variences);
        let prizePercentiles = getPercentiles(reversedVariences);
        let totalPrize = 0;
        for (i in ub) {
                if (!winners.includes(parseInt(i))) {
                        totalPrize += ub[i];
                }
        }

        console.log("Winners: ", winners);
        console.log("Mean: ", mean);
        console.log("Correct Answers: ", ca);
        console.log("Total Prize: ", totalPrize);
        console.log("Variences: ", variences);
        console.log("Reversed Variences: ", reversedVariences);
        console.log("Prize Percentiles: ", prizePercentiles);

        return {
		answers: gd,
                correctAnswers: ca,
                winners: winners,
                meanBid: mean,
                totalPrize: totalPrize,
                prizePercentiles: prizePercentiles,
                errorCode: 0,
                errorMessage: ""
        };
};

module.exports = {
	doValidation
};
