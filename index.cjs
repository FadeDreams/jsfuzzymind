// fuzzySet.js
class FuzzySet {
    constructor(name, membershipFunction) {
        this.name = name;
        this.membershipFunction = membershipFunction;
    }

    membershipDegree(x) {
        return this.membershipFunction(x);
    }

    // Union of two fuzzy sets
    union(otherSet) {
        return new FuzzySet(`Union(${this.name}, ${otherSet.name})`, x =>
            Math.max(this.membershipFunction(x), otherSet.membershipFunction(x))
        );
    }

    // Intersection of two fuzzy sets
    intersection(otherSet) {
        return new FuzzySet(`Intersection(${this.name}, ${otherSet.name})`, x =>
            Math.min(this.membershipFunction(x), otherSet.membershipFunction(x))
        );
    }

    // Complement of the fuzzy set
    complement() {
        return new FuzzySet(`Complement(${this.name})`, x =>
            1 - this.membershipFunction(x)
        );
    }

    // Normalize the membership function (if needed)
    normalize() {
        return new FuzzySet(`Normalized(${this.name})`, x =>
            this.membershipFunction(x) / Math.max(1, this.membershipFunction(x))
        );
    }

    // Defuzzification: Centroid method
    centroid(min, max, step = 0.01) {
        let numerator = 0;
        let denominator = 0;
        for (let x = min; x <= max; x += step) {
            const mu = this.membershipFunction(x);
            numerator += x * mu;
            denominator += mu;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }
}

// fuzzyRule.js
class FuzzyRule {
    constructor(condition, consequence, weight = 1) {
        this.condition = condition;
        this.consequence = consequence;
        this.weight = weight;
    }

    evaluate(inputs) {
        if (this.condition(inputs)) {
            const result = this.consequence instanceof FuzzySet ? this.consequence : this.consequence(inputs);
            return { result, weight: this.weight };
        }
        return null;
    }
}

// inferenceEngine.js
class InferenceEngine {
    constructor(rules) {
        this.rules = rules;
    }

    infer(inputs) {
        let results = [];
        for (const rule of this.rules) {
            const evaluation = rule.evaluate(inputs);
            if (evaluation) {
                results.push(evaluation);
            }
        }
        return this.aggregateResults(results);
    }

    aggregateResults(results) {
        if (results.length === 0) return 'Low Priority';

        let totalWeight = 0;
        let weightedSum = 0;
        results.forEach(({ result, weight }) => {
            weightedSum += this.priorityMapping(result) * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? this.reversePriorityMapping(weightedSum / totalWeight) : 'Low Priority';
    }

    priorityMapping(priority) {
        switch (priority) {
            case 'Urgent': return 3;
            case 'High Priority': return 2;
            case 'Medium Priority': return 1;
            default: return 0;
        }
    }

    reversePriorityMapping(score) {
        if (score >= 2.5) return 'Urgent';
        if (score >= 1.5) return 'High Priority';
        if (score >= 0.5) return 'Medium Priority';
        return 'Low Priority';
    }

    getFuzzySetConsequences() {
        return this.rules
            .map(rule => rule.consequence)
            .filter(consequence => consequence instanceof FuzzySet);
    }

    defuzzifyCentroid(min, max, step = 0.01) {
        let numerator = 0;
        let denominator = 0;
        const fuzzySets = this.getFuzzySetConsequences();
        for (let x = min; x <= max; x += step) {
            let mu = 0;
            for (const fuzzySet of fuzzySets) {
                mu = Math.max(mu, fuzzySet.membershipFunction(x));
            }
            numerator += x * mu;
            denominator += mu;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }

    defuzzifyMOM(min, max, step = 0.01) {
        let maxMu = 0;
        let sumX = 0;
        let count = 0;
        const fuzzySets = this.getFuzzySetConsequences();
        for (let x = min; x <= max; x += step) {
            let mu = 0;
            for (const fuzzySet of fuzzySets) {
                mu = Math.max(mu, fuzzySet.membershipFunction(x));
            }
            if (mu > maxMu) {
                maxMu = mu;
                sumX = x;
                count = 1;
            } else if (mu === maxMu) {
                sumX += x;
                count++;
            }
        }
        return count === 0 ? 0 : sumX / count;
    }

    defuzzifyBisector(min, max, step = 0.01) {
        let totalArea = 0;
        let leftArea = 0;
        let bisector = min;
        const fuzzySets = this.getFuzzySetConsequences();
        for (let x = min; x <= max; x += step) {
            let mu = 0;
            for (const fuzzySet of fuzzySets) {
                mu = Math.max(mu, fuzzySet.membershipFunction(x));
            }
            totalArea += mu * step;
        }
        for (let x = min; x <= max; x += step) {
            let mu = 0;
            for (const fuzzySet of fuzzySets) {
                mu = Math.max(mu, fuzzySet.membershipFunction(x));
            }
            leftArea += mu * step;
            if (leftArea >= totalArea / 2) {
                bisector = x;
                break;
            }
        }
        return bisector;
    }
}

module.exports = { FuzzySet, FuzzyRule, InferenceEngine };

