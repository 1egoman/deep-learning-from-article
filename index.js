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
function getGradient(f, numArgs=2) {
  const outputs = [];
  for (let i = 0; i < numArgs; i++) {
    // Initialize an array of all zeros
    let args = [];
    for (let i = 0; i < numArgs; i++) {
      args.push(0);
    }

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
    const derivative = (secondOutput - firstOutput) / INFINITESIMAL

    outputs.push(derivative);
  }

  return outputs;
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
  const output = subtract(add(a, b), c);
  console.log("* Current output is", output);

  // Calculate which way the inputs should move (and by how much) to increase the output
  const addSlopes = getGradient(add, 2);
  const subtractSlopes = getGradient(subtract, 2);

  // Multiply the "tugs" of each input, walking down the tree toward the nodes at the end to calculate
  // the "effective slopes" of each input.
  slopeOfA = addSlopes[0] * subtractSlopes[0];
  slopeOfB = addSlopes[1] * subtractSlopes[0];
  slopeOfC = subtractSlopes[1];

  if (target < output) {
    slopeOfA = -1 * slopeOfA;
    slopeOfB = -1 * slopeOfB;
    slopeOfC = -1 * slopeOfC;
  }

  console.log("* Slopes to trend toward our target:", slopeOfA, slopeOfB, slopeOfC);

  // Apply the slopes of each 
  a += stepSize * slopeOfA;
  b += stepSize * slopeOfB;
  c += stepSize * slopeOfB;

  const result = subtract(add(a, b), c);
  console.log("* Result after applying slopes:", result);
}
