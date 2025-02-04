const fs = require("fs");

const filePath = process.argv[2];

const file = fs.readFileSync(filePath, { encoding: "utf-8" }).split(/\r?\n/);

const N_Lines = [];

const Q_Lines = [];

const n_linesStart = 1;

const n_linesEnd = Number(file[0]);

const q_linesStart = n_linesEnd + 2;

const q_linesEnd = file.length - 1;

const output = [];

for (let i = n_linesStart; i <= n_linesEnd; i++) {
  const temp = file[i].split(" ");

  const y_lowerBound = Number(temp[0]);

  const x_lowerBound = Number(temp[1]);

  const width = Number(temp[2]);

  const height = Number(temp[3]);

  const y_upperBound = y_lowerBound + height - 1;

  const x_upperBound = x_lowerBound + width - 1;

  N_Lines.push({ y_lowerBound, y_upperBound, x_lowerBound, x_upperBound });
}

for (let i = q_linesStart; i <= q_linesEnd; i++) {
  const temp = file[i].split(" ");

  const y = temp[0];

  const x = temp[1];

  Q_Lines.push({ y, x });
}

for (let i = 0; i < Q_Lines.length; i++) {
  const query = Q_Lines[i];

  for (let k = N_Lines.length - 1; k >= 0; k--) {
    const { y_lowerBound, y_upperBound, x_lowerBound, x_upperBound } =
      N_Lines[k];

    if (
      query.y >= y_lowerBound &&
      query.y <= y_upperBound &&
      query.x >= x_lowerBound &&
      query.x <= x_upperBound
    ) {
      output.push(`scroll ${k + 1}`);
      break;
    } else if (k === 0) {
      output.push("no scroll");
    }
  }
}

console.log(output);
