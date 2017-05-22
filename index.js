function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
function power(a, b) {
  return Math.pow(a, b);
}

// A super tiny number used to calculate derivatives.
const INFINITESIMAL = 0.0001;

// This function answers this question: when the output increases by one, how do the inputs to the
// function change?
//
// // At point (0, 0), how do a and b change when the result of `(a, b) => a + b` increases by 1?
// getGradient((a, b) => a + b, [0, 0])
function getGradient(f, initialValues) {
  const outputs = [];
  for (let i = 0; i < initialValues.length; i++) {
    let args = initialValues.slice();

    // Call the function with a number of inputs
    const firstOutput = f.apply(this, args);

    // Increment each input by an infinitesimal amount
    args = args.map((a, ct) => {
      if (ct === i) {
        return a + INFINITESIMAL;
      } else {
        return a;
      }
    });

    // Run again, so we can calculate which way the output of a function "trends" when given known
    // input data.
    const secondOutput = f.apply(this, args);

    // Calculate the slope of the change from firstInput => secondOutput
    // This is calc. But really, think of it as the slope equasion, change in y over change in x:
    // derivative = (  f(x + h) - f(x)  ) / (  h - 0  )
    const derivative = (secondOutput - firstOutput) / INFINITESIMAL;

    outputs.push(derivative);
  }

  return outputs;
}

// Are two numbers negligibly the same number?
// ie, 2 is about 2.001.
function prettyMuchEqual(a, b) {
  return Math.abs(a - b) < 0.01;
}

const stepSize = 0.01;

const target = 2;
let a = 2;
let b = 2;
let c = 3;
console.log("* Target is", target);

let slopeOfA, slopeOfB, slopeOfC;

while (true) {
  console.log("== Starting interation. A =", a, "B =", b, "C =", c);

  // Figure out what the current value is.
  const output = add(power(a, b), divide(c, 2));
  console.log("* Current output is", output);

  // Calculate which way the inputs should move (and by how much) to increase the output
  const addSlopes = getGradient(add, [power(a, b), divide(c, 2)]);
  const powerSlopes = getGradient(power, [a, b]);
  const divideSlopes = getGradient(divide, [c, 2]);

  // Multiply the "tugs" of each input, walking down the tree toward the nodes at the end to calculate
  // the "effective slopes" of each input.
  slopeOfA = addSlopes[0] * powerSlopes[0];
  slopeOfB = addSlopes[0] * powerSlopes[1];
  slopeOfC = addSlopes[1] * divideSlopes[0];

  if (target < output) {
    slopeOfA *= -1;
    slopeOfB *= -1;
    slopeOfC *= -1;
  }

  console.log("* Slopes to trend toward our target:", slopeOfA, slopeOfB, slopeOfC);

  // Apply the slopes of each 
  a += stepSize * slopeOfA;
  b += stepSize * slopeOfB;
  c += stepSize * slopeOfB;

  const result = add(power(a, b), divide(c, 2));
  console.log("* Result after applying slopes:", result);

  if (prettyMuchEqual(result, target)) {
    console.log("We're at the target!")
    break
  }
}
