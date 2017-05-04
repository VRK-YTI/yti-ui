import { default as fetch, Response } from 'node-fetch';

const groupGraph = require('../examples/groupGraph.json');
const groupTypes = require('../examples/groupTypes.json');
const groupNodes = require('../examples/groupNodes.json');

const orgGraph = require('../examples/orgGraph.json');
const orgTypes = require('../examples/orgTypes.json');
const orgNodes = require('../examples/orgNodes.json');

const terminologicalGraph = require('../examples/termDictGraph.json');
const terminologicalTypes = require('../examples/termDictTypes.json');
const thesaurusGraph = require('../examples/thesaurusGraph.json');
const thesaurusTypes = require('../examples/thesaurusTypes.json');

const jhsGraph = require('../examples/jhsGraph.json');
const jhsTypes = require('../examples/jhsTypes.json');
const jhsNodes = require('../examples/jhsNodes.json');

const oksaGraph = require('../examples/oksaGraph.json');
const oksaTypes = require('../examples/oksaTypes.json');
const oksaNodes = require('../examples/oksaNodes.json');

const sosGraph = require('../examples/sosGraph.json');
const sosTypes = require('../examples/sosTypes.json');
const sosNodes = require('../examples/sosNodes.json');

const username = 'admin';
const password = 'admin';

function btoa(s: string): string {
  return new Buffer(s).toString('base64');
}

const endpoint = process.argv.length > 2 ? process.argv[2] : 'http://localhost:8080/api';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Basic ${btoa(`${username}:${password}`)}`
};

function handleErrors(response: Response): Response {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function createGraph(graph: any): Promise<any> {
  return fetch(`${endpoint}/graphs`, { headers, method: 'POST', body: JSON.stringify(graph) }).then(handleErrors);
}

function createTypes(graphId: any, types: any): Promise<any> {
  return fetch(`${endpoint}/graphs/${graphId}/types?batch=true`, { headers, method: 'POST', body: JSON.stringify(types) }).then(handleErrors);
}

function createNodes(nodes: any): Promise<any> {
  return fetch(`${endpoint}/nodes?batch=true`, { headers, method: 'POST', body: JSON.stringify(nodes) }).then(handleErrors);
}

function initData(name: string, graph: any, types: any, nodes?: any): Promise<any> {
  return createGraph(graph)
    .then(() => createTypes(graph.id, types))
    .then(() => Promise.resolve(nodes ? createNodes(nodes) : ''))
    .then(() => console.log(name));
}

Promise.all([
  initData('Groups', groupGraph, groupTypes, groupNodes),
  initData('Organizations', orgGraph, orgTypes, orgNodes)
]).then(() => Promise.all([
  initData('Terminological vocabulary template', terminologicalGraph, terminologicalTypes),
  initData('Vocabulary template', thesaurusGraph, thesaurusTypes),
  initData('JHS', jhsGraph, jhsTypes, jhsNodes),
  initData('SOS', sosGraph, sosTypes, sosNodes),
  initData('OKSA', oksaGraph, oksaTypes, oksaNodes)
])).then(() => console.log('========\nOK'));
