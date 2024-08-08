### jsFuzzyMind

This library provides a set of classes for implementing fuzzy logic systems in JavaScript. It includes support for defining fuzzy sets, fuzzy rules, and performing inference using an inference engine. It also provides methods for defuzzification using different techniques. For example, you can use this library to build a fuzzy logic-based risk assessment system for financial investments. In this system, fuzzy sets could represent risk levels (such as "Low Risk", "Medium Risk", "High Risk"), and rules could determine investment strategies based on market indicators. The inference engine would evaluate these rules to suggest an appropriate investment strategy, and defuzzification methods like the Mean of Maximum (MOM) could be used to provide a precise risk score for decision-making.

#### FuzzySet

Represents a fuzzy set with a membership function. Provides methods for operations on fuzzy sets.
```javascript
new FuzzySet(name, membershipFunction)
// name: The name of the fuzzy set.
// membershipFunction: A function that defines the membership degree of the set.
```

##### Methods
- membershipDegree(x): Returns the membership degree of x.
- union(otherSet): Returns a new fuzzy set representing the union of this set and otherSet.
- intersection(otherSet): Returns a new fuzzy set representing the intersection of this set and otherSet.
- complement(): Returns a new fuzzy set representing the complement of this set.
- normalize(): Returns a new fuzzy set with normalized membership function.
- centroid(min, max, step): Performs defuzzification using the centroid method.

#### FuzzyRule
Represents a fuzzy rule consisting of a condition and a consequence.
```javascript
new FuzzyRule(condition, consequence, weight)
// condition: A function that takes inputs and returns a boolean indicating if the rule condition is satisfied.
// consequence: The result of the rule if the condition is true. Can be a fuzzy set or a function.
// weight: An optional weight for the rule (default is 1).
```

##### Methods
- evaluate(inputs): Evaluates the rule against the given inputs and returns the result and weight if the condition is satisfied.

#### InferenceEngine
Uses a set of fuzzy rules to perform inference and defuzzification.

```javascript
new InferenceEngine(rules) //rules: An array of FuzzyRule instances.
```
##### Methods
- infer(inputs): Performs inference based on the input values and returns the aggregated result.
- aggregateResults(results): Aggregates results from the fuzzy rules.
- defuzzifyCentroid(min, max, step): Performs defuzzification using the centroid method.
- defuzzifyMOM(min, max, step): Performs defuzzification using the Mean of Maxima (MOM) method.
- defuzzifyBisector(min, max, step): Performs defuzzification using the Bisector method.
- getFuzzySetConsequences(): Returns a list of fuzzy sets as consequences of the rules.


##### Example Usage CommonJS

```javascript
const { FuzzySet, FuzzyRule, InferenceEngine } = require('jsfuzzymind');

// Define fuzzy sets for urgency and complexity
const urgencySet = new FuzzySet('Urgency', urgency => {
    if (urgency < 3) return 0;
    if (urgency < 7) return (urgency - 3) / 4;
    return 1;
});
const complexitySet = new FuzzySet('Complexity', complexity => {
    if (complexity < 2) return 0;
    if (complexity < 5) return (complexity - 2) / 3;
    return 1;
});

// Define fuzzy rules
const rules = [
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) > 0.7 && complexitySet.membershipDegree(inputs.complexity) > 0.7,
        new FuzzySet('Urgent', x => x >= 7 ? 1 : x / 7)
    ),
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) > 0.5,
        () => 'High Priority'
    ),
    new FuzzyRule(
        inputs => complexitySet.membershipDegree(inputs.complexity) > 0.5,
        () => 'Medium Priority'
    ),
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) <= 0.5 && complexitySet.membershipDegree(inputs.complexity) <= 0.5,
        () => 'Low Priority'
    )
];

const engine = new InferenceEngine(rules);

// Example ticket
const ticket = { urgency: 8, complexity: 6 };
const priority = engine.infer(ticket);
console.log(`Ticket Priority: ${priority}`);

// Defuzzification examples
const centroid = urgencySet.centroid(0, 10);
console.log(`Centroid defuzzification: ${centroid}`);

const defuzzifiedCentroid = engine.defuzzifyCentroid(0, 10);
console.log(`Defuzzified Centroid: ${defuzzifiedCentroid}`);

const defuzzifiedMOM = engine.defuzzifyMOM(0, 10);
console.log(`Defuzzified MOM: ${defuzzifiedMOM}`);

const defuzzifiedBisector = engine.defuzzifyBisector(0, 10);
console.log(`Defuzzified Bisector: ${defuzzifiedBisector}`);
```

##### Example Usage ES Modules

```JavaScript
import { FuzzySet, FuzzyRule, InferenceEngine } from 'jsfuzzymind';

// Define fuzzy sets for urgency and complexity
const urgencySet = new FuzzySet('Urgency', urgency => {
    if (urgency < 3) return 0;
    if (urgency < 7) return (urgency - 3) / 4;
    return 1;
});

const complexitySet = new FuzzySet('Complexity', complexity => {
    if (complexity < 2) return 0;
    if (complexity < 5) return (complexity - 2) / 3;
    return 1;
});

// Define fuzzy rules
const rules = [
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) > 0.7 && complexitySet.membershipDegree(inputs.complexity) > 0.7,
        new FuzzySet('Urgent', x => x >= 7 ? 1 : x / 7)
    ),
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) > 0.5,
        () => 'High Priority'
    ),
    new FuzzyRule(
        inputs => complexitySet.membershipDegree(inputs.complexity) > 0.5,
        () => 'Medium Priority'
    ),
    new FuzzyRule(
        inputs => urgencySet.membershipDegree(inputs.urgency) <= 0.5 && complexitySet.membershipDegree(inputs.complexity) <= 0.5,
        () => 'Low Priority'
    )
];

const engine = new InferenceEngine(rules);

// Example ticket
const ticket = { urgency: 8, complexity: 6 };
const priority = engine.infer(ticket);
console.log(`Ticket Priority: ${priority}`);

// Defuzzification examples
const centroid = urgencySet.centroid(0, 10);
console.log(`Centroid defuzzification: ${centroid}`);

const defuzzifiedCentroid = engine.defuzzifyCentroid(0, 10);
console.log(`Defuzzified Centroid: ${defuzzifiedCentroid}`);

const defuzzifiedMOM = engine.defuzzifyMOM(0, 10);
console.log(`Defuzzified MOM: ${defuzzifiedMOM}`);

const defuzzifiedBisector = engine.defuzzifyBisector(0, 10);
console.log(`Defuzzified Bisector: ${defuzzifiedBisector}`);
```
