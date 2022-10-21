const fs = require('fs');

const fileNames = [
  // 'admin',
  'alert',
  // 'collection',
  // 'common',
  // 'concept',
  // 'own-information',
  //'sample'
];

const encoding = 'utf8';
const jsonPath = '../public/locales/fi';

function handleKey(stream, data, key) {
  Object.keys(data).map((k) => {
    let currentKey = key ? `${key}.${k}` : k;
    if (typeof data[k] === 'object') {
      handleKey(stream, data[k], currentKey);
    } else {
      stream.write(Buffer.from(`${currentKey};${data[k]};\n`, encoding));
    }
  });
}

function json2csv() {
  fileNames.forEach((fileName) => {
    const translations = JSON.parse(
      fs.readFileSync(`${jsonPath}/${fileName}.json`, encoding)
    );
    const stream = fs.createWriteStream(`csv/${fileName}.csv`, encoding);
    stream.write('KEY;FI;SV\n');

    handleKey(stream, translations);
  });
}

function handleNestedObject(nestedObj, keyParts, value) {
  for (let i = 0; i < keyParts.length; i++) {
    const keyPart = keyParts[i];

    if (keyParts.length > 1) {
      if (!nestedObj[keyPart]) {
        nestedObj[keyPart] = {};
      }

      if (keyParts.length === 1) {
        nestedObj[keyPart] = value;
      } else {
        nestedObj[keyPart] = handleNestedObject(
          nestedObj[keyPart],
          keyParts.slice(1),
          value
        );
        break;
      }
    } else {
      nestedObj[keyPart] = value;
    }
  }
  return nestedObj;
}

function csv2json() {
  fileNames.forEach((fileName) => {
    const data = fs.readFileSync(`csv/${fileName}.csv`, encoding);

    const translations = data.split(/\n/).reduce((result, line, idx) => {
      const parts = line.split(';');
      if (idx > 0 && parts.length === 3) {
        const key = parts[0];
        const value = parts[2];
        const keyParts = key.split('.');

        if (keyParts.length === 1) {
          result[key] = value;
        } else {
          let nestedObj = result[keyParts[0]] || {};
          const n = handleNestedObject(nestedObj, keyParts.slice(1), value);
          result[keyParts[0]] = n;
        }
      }
      return result;
    }, {});

    fs.writeFileSync(
      `json/${fileName}.json`,
      JSON.stringify(translations, null, 2)
    );
  });
}

const target = process.argv[2];

if (target === 'json2csv') {
  json2csv();
} else if (target === 'csv2json') {
  csv2json();
} else {
  console.info('Specify target csv2json or json2csv');
}
