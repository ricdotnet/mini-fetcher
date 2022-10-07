const url = require('url');

function resolveProtocol(inputUrl) {
  const adapters = {
    'http:': require('http'),
    'https:': require('https'),
  }
  
  return adapters[url.parse(inputUrl).protocol];
}

const httpMethods = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
  'tunnel',
];

module.exports = {
  resolveProtocol,
  httpMethods
};
