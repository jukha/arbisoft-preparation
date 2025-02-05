const fs = require("fs");

const filePath = process.argv[2];

const phoneMap = new Map();

const file = fs.readFileSync(filePath, { encoding: "utf-8" }).split(/\r?\n/);

const delimiters = ["(", ")", "+", "-", " "];

const translation = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

const groupingTranslation = {
  1: "",
  2: "double",
  3: "triple",
  4: "quadruple",
  5: "quintuple",
  6: "sextuple",
  7: "septuple",
  8: "octuple",
  9: "nonuple",
  10: "decuple",
};

const output = [];

const isCurrentCharDelimiter = (currentChar) => {
  const result = delimiters.find((delimiter) => delimiter === currentChar);
  if (result) return true;
  else return false;
};

const removeDelimiters = (phoneNo) => {
  const phoneNoArr = [];

  for (let i = 0; i < phoneNo.length; i++) {
    const currentChar = phoneNo[i];

    if (!isCurrentCharDelimiter(currentChar)) phoneNoArr.push(currentChar);
  }

  const numberWithoutDelimiters = phoneNoArr.join("");

  return numberWithoutDelimiters;
};

const parseInput = () => {
  for (let i = 1; i < file.length; i++) {
    const currentPhoneNo = removeDelimiters(file[i]);

    if (phoneMap.has(currentPhoneNo)) {
      const phonePreData = phoneMap.get(currentPhoneNo);
      phoneMap.set(currentPhoneNo, {
        ...phonePreData,
        formats: [...phonePreData.formats, file[i]],
      });
    } else {
      phoneMap.set(currentPhoneNo, { formats: [file[i]], pronunciations: [] });
    }
  }
};

const generateOutput = () => {
  const phoneMapArr = [...phoneMap.entries()];

  for (let i = 0; i < phoneMapArr.length; i++) {
    const phoneKey = phoneMapArr[i][0];

    const phoneFormats = phoneMapArr[i][1].formats;

    output.push(phoneKey);
    for (let j = 0; j < phoneFormats.length; j++) {
      const currentFormatValue = phoneFormats[j];

      let currentFormatValueOutput = "";

      let repeatingChar = null;

      let repeatingCount = 0;

      let tempGroupingTranslation;

      for (let k = 0; k < currentFormatValue.length; k++) {
        let currentChar = currentFormatValue[k];
        if (isCurrentCharDelimiter(currentChar)) {
          if (repeatingChar !== null) {
            if (!isCurrentCharDelimiter(repeatingChar)) {
              tempGroupingTranslation = ` ${groupingTranslation[repeatingCount]} ${translation[repeatingChar]} `;
              currentFormatValueOutput += tempGroupingTranslation;
            }
            repeatingChar = currentFormatValue[k + 1];
            repeatingCount = 0;
          } else {
            repeatingChar = currentFormatValue[k + 1];
            continue;
          }
        } else {
          if (repeatingChar === null) {
            repeatingChar = currentChar;
            repeatingCount++;
          } else if (repeatingChar === currentChar) {
            repeatingCount++;
          } else if (repeatingChar !== currentChar && repeatingChar !== null) {
            if (repeatingCount > 1) {
              tempGroupingTranslation = ` ${groupingTranslation[repeatingCount]} ${translation[repeatingChar]} `;
              currentFormatValueOutput += tempGroupingTranslation;
            } else {
              currentFormatValueOutput += translation[repeatingChar] + " ";
            }
            repeatingChar = currentChar;
            repeatingCount = 1;
          }
        }
      }
      // After exiting the kth-loop look for the ongoing grouping patter e.g, 3333
      if (repeatingCount > 1) {
        tempGroupingTranslation = ` ${groupingTranslation[repeatingCount]} ${translation[repeatingChar]} `;
        currentFormatValueOutput += tempGroupingTranslation;
      } else {
        currentFormatValueOutput += translation[repeatingChar];
      }

      const formattedPronunciation = currentFormatValueOutput
        .split("  ")
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .trim();

      const existingPronunciationsForPhone =
        phoneMap.get(phoneKey).pronunciations;

      let currentPronunciationAlreadyExist = false;

      for (let p = 0; p < existingPronunciationsForPhone.length; p++) {
        if (existingPronunciationsForPhone[p] === formattedPronunciation) {
          currentPronunciationAlreadyExist = true;
        }
      }

      if (!currentPronunciationAlreadyExist) {
        existingPronunciationsForPhone.push(formattedPronunciation);

        const phonePreData = phoneMap.get(phoneKey);
        phoneMap.set(phoneKey, {
          ...phonePreData,
          pronunciations: existingPronunciationsForPhone,
        });

        output.push(formattedPronunciation);
      }
    }
  }
  const outputForFile = output.join("\n");
  console.log(output);
  fs.writeFileSync("2_ouput.txt", outputForFile);
  return outputForFile;
};

parseInput();

generateOutput();
