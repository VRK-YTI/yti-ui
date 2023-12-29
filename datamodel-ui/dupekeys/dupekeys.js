const fs = require('fs');

const encoding = 'utf8';
const jsonPath = '../public/locales/fi';

function checkKeyDuplicates(file1, file2) {
  if (!file1 || file1 === '' || !file2 || file2 === '') {
    console.log('Specify filenames');
    return;
  }
  const firstTrans = JSON.parse(
    fs.readFileSync(`${jsonPath}/${file1}.json`, encoding)
  );

  const keys = Object.keys(firstTrans);

  const secondTrans = JSON.parse(
    fs.readFileSync(`${jsonPath}/${file2}.json`, encoding)
  );

  Object.entries(secondTrans).forEach(([key, value]) => {
    if (keys.includes(key)) {
      console.log(
        `[${key}] \n ${file1} text: ${value} \n ${file2} text: ${firstTrans[key]}`
      );
    }
  });
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function checkValueDuplicates(file1, file2) {
  if (!file1 || file1 === '' || !file2 || file2 === '') {
    console.log('Specify filenames');
    return;
  }
  const firstTrans = JSON.parse(
    fs.readFileSync(`${jsonPath}/${file1}.json`, encoding)
  );

  const values = Object.values(firstTrans).filter((val) => val && val !== '');

  const secondTrans = JSON.parse(
    fs.readFileSync(`${jsonPath}/${file2}.json`, encoding)
  );

  Object.entries(secondTrans).forEach(([key, value]) => {
    if (values.includes(value)) {
      console.log(
        `[${value}] \n ${file1} key: ${key} \n ${file2} key: ${[
          getKeyByValue(firstTrans, value),
        ]}`
      );
    }
  });
}

function checkValueDuplicatesSameFile(file1) {
  if (!file1 || file1 === '') {
    console.log('Specify filename');
    return;
  }
  const trans = JSON.parse(
    fs.readFileSync(`${jsonPath}/${file1}.json`, encoding)
  );

  const uniqueValues = {};

  Object.entries(trans).forEach(([key, value]) => {
    if (uniqueValues[value]) {
      console.log(`[${value}]\n key1: ${key}\n key2: ${uniqueValues[value]}`);
    } else {
      uniqueValues[value] = key;
    }
  });
}

const arg = process.argv[2];
const file1 = process.argv[3];
const file2 = process.argv[4];

if (arg === 'key') {
  checkKeyDuplicates(file1, file2);
} else if (arg === 'value') {
  checkValueDuplicates(file1, file2);
} else if (arg === 'singlefile') {
  checkValueDuplicatesSameFile(file1);
} else {
  console.log('Choose key or value');
}
