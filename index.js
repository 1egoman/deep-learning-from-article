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
const ASCENDING = 1, DECENDING = -1;

// This function answers this question: when the output increases by one, how do the inputs to the
// function change?
//
// // At point (0, 0), how do a and b change when the result of `(a, b) => a + b` increases by 1?
// getGradient((a, b) => a + b, [0, 0])
function getGradient({func, initialValues, direction}) {
  const outputs = [];
  for (let i = 0; i < initialValues.length; i++) {
    let args = initialValues.slice();

    // Call the function with a number of inputs
    const firstOutput = func.apply(this, args);

    // Increment each input by an infinitesimal amount
    args = args.map((a, ct) => {
      if (ct === i) {
        return a + (direction * INFINITESIMAL);
      } else {
        return a;
      }
    });

    // Run again, so we can calculate which way the output of a function "trends" when given known
    // input data.
    const secondOutput = func.apply(this, args);

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

const target = 3;
let a = 1;
let b = 1;
let c = 1;
console.log("* Target is", target);

let slopeOfA, slopeOfB, slopeOfC;

while (true) {
  console.log("== Starting interation. A =", a, "B =", b, "C =", c);

  // Figure out what the current value is.
  const output = add(power(a, b), divide(c, 2));
  console.log("* Current output is", output);

  // Calculate which way the inputs should move (and by how much) to increase the output
  const addSlopes = getGradient({
    func: add,
    initialValues: [power(a, b), divide(c, 2)],
    direction: target > output ? ASCENDING : DECENDING, // Should we move up or down the graph?
  });
  const powerSlopes = getGradient({
    func: power,
    initialValues: [a, b],
    direction: target > output ? ASCENDING : DECENDING, // Should we move up or down the graph?
  });
  const divideSlopes = getGradient({
    func: divide,
    initialValues: [c, 2],
    direction: target > output ? ASCENDING : DECENDING, // Should we move up or down the graph?
  });

  // Multiply the "tugs" of each input, walking down the tree toward the nodes at the end to calculate
  // the "effective slopes" of each input.
  slopeOfA = addSlopes[0] * powerSlopes[0];
  slopeOfB = addSlopes[0] * powerSlopes[1];
  slopeOfC = addSlopes[1] * divideSlopes[0];

  // Invert the movment if the target is less than the output.
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
    console.log("We're at the target!");
    break
  }
}
