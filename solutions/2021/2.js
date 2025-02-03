const fs = require("fs");

const filePath = process.argv[2];

const file = fs.readFileSync(filePath, { encoding: "utf-8" }).split(/\r?\n/);

const clientsOriginalOrder = [];

const inputArr = file
  .filter((_, idx) => idx !== 0)
  .join(",")
  .split(",");

for (let i = 0; i < inputArr.length; i += 2) {
  //   odd indexes are client names and right next idx is their budget
  const obj = { name: inputArr[i], budget: inputArr[i + 1], index: i / 2 };
  clientsOriginalOrder.push(obj);
}

const clientsCopy = [...clientsOriginalOrder];

const MAX_RESCHEDULED_TIMES = 2;

const clientsBestOrder = clientsCopy.sort((a, b) => b.budget - a.budget);

for (let i = 0; i < clientsBestOrder.length; i++) {
  const currentClientIdxInOriginalOrder = clientsOriginalOrder.findIndex(
    (client) => client.index === clientsBestOrder[i].index
  );

  if (i <= currentClientIdxInOriginalOrder) continue;
  else {
    const rescheduledTimes = i - currentClientIdxInOriginalOrder;
    console.log(rescheduledTimes);
    if (rescheduledTimes >= MAX_RESCHEDULED_TIMES) {
      const currentClientFairIndex =
        currentClientIdxInOriginalOrder + MAX_RESCHEDULED_TIMES;

      const unfairClientAtIdx = clientsBestOrder[currentClientFairIndex];

      const fairClientForIdx = clientsBestOrder[i];

      clientsBestOrder[currentClientFairIndex] = fairClientForIdx;

      clientsBestOrder[i] = unfairClientAtIdx;
    }
  }
}
console.log("====================");
console.log("OUTPUT");
console.log(clientsBestOrder);
console.log("====================");
