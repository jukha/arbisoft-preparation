const fs = require("fs");

const filePath = process.argv[2];

const API_URL = "https://www.jsonkeeper.com/b/ZVOV";

const fetchData = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const calculateDiscount = (pricePrevious, priceNow, roundOff = true) => {
  const discount = (100 / pricePrevious) * (pricePrevious - priceNow);

  if (!roundOff) return discount;
  return Math.round(discount);
};

const writeOutput = (data) => {
  fs.writeFileSync("1_output.txt", data);
};

const findProducts = (data) => {
  const file = fs.readFileSync(filePath, { encoding: "utf-8" }).split(/\r?\n/);

  const inputArr = file
    .filter((_, idx) => idx !== 0)
    .join(",")
    .split(",");

  const totalTests = Number(file[0]);

  const outputArray = new Array(totalTests).fill(0);

  for (let i = 0; i < totalTests + 1; i = i + 2) {
    const testCollectionName = inputArr[i];

    data.filter((product) => {
      if (product.collection === testCollectionName) {
        const isDiscountPossible = product.previous_price - product.price > 0;

        const testCollectionDiscountLimit = Number(inputArr[i + 1]);

        if (isDiscountPossible) {
          const discount = calculateDiscount(
            product.previous_price,
            product.price
          );

          if (discount >= testCollectionDiscountLimit) {
            outputArray[0] += 1;
          }
        }
      }
    });
  }
  const outputData = outputArray.join("\n");
  console.log(outputData);
  writeOutput(outputData);
};

const main = async () => {
  const data = await fetchData();
  findProducts(data);
};

main();
