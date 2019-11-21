// import { default as fetch, Response } from 'node-fetch';
import { Response }  from 'node-fetch';

const fetch = require('node-fetch');

const jhs = require('../examples/jhs.json');
const jhsVocabulary = require('../examples/jhs-vocabulary.json');
const oksa = require('../examples/oksa.json');
const oksaVocabulary = require('../examples/oksa-vocabulary.json');
const sos = require('../examples/sos.json');
const sosVocabulary = require('../examples/sos-vocabulary.json');
const kira = require('../examples/kira.json');
const kiraVocabulary = require('../examples/kira-vocabulary.json');

const mail = 'ytitestaaja@gmail.com';
const endpoint = process.argv.length > 2 ? process.argv[2] : 'http://localhost:8001/terminology-api/api/v1/frontend';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

function handleErrors(response: Response): Response {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function createVocabulary(prefix: string, type: 'Vocabulary'|'TerminologicalVocabulary', vocabularyNode: any): Promise<any> {

  const templateGraphId = type === 'Vocabulary' ? 'b387af64-4c66-4542-95f3-4c33c6831fcc' : '61cf6bde-46e6-40bb-b465-9b2c66bf4ad8';
  const graphId = vocabularyNode.type.graph.id;
  const url = `${endpoint}/vocabulary?sync=false&templateGraphId=${templateGraphId}&prefix=${prefix}&graphId=${graphId}&fake.login.mail=${mail}`;

  return fetch(url, { headers, method: 'POST', body: JSON.stringify(vocabularyNode) }).then(handleErrors);
}

function createNodes(nodes: any): Promise<any> {

  const body = {
    delete: [],
    save: nodes
  };

  return fetch(`${endpoint}/modify?sync=false&fake.login.mail=${mail}`, { headers, method: 'POST', body: JSON.stringify(body) }).then(handleErrors);
}

function initData(prefix: string, type: 'Vocabulary'|'TerminologicalVocabulary', vocabularyNode: any, nodes: any): Promise<any> {
  return createVocabulary(prefix, type, vocabularyNode)
    .then(() => createNodes(nodes))
    .then(() => console.log('SUCCESS with "' + prefix + '"'))
    .catch((reason: any) => console.log('ERROR with "' + prefix + '":' + reason));
}

Promise.all([
  initData('jhs', 'TerminologicalVocabulary', jhsVocabulary, jhs),
  initData('sos', 'TerminologicalVocabulary', sosVocabulary, sos),
  initData('oksa', 'TerminologicalVocabulary', oksaVocabulary, oksa),
  initData('kira', 'TerminologicalVocabulary', kiraVocabulary, kira)
]).then(() => console.log('========\nOK'))
  .catch((reason: any) => console.log('========\nERROR: "' + reason + '"'));
