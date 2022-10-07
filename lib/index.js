const clone = require('lodash.clone');
const utils = require('./utils');
const data = [];
let miniFetcherResponse = {};

const userAgent = {
  'User-Agent': 'Mini-Fetcher'
};

const request = (url, options) => new Promise((resolve, reject) => {
  const mergedHeaders = {
    headers: {
      ...options.headers, ...userAgent
    }
  };

  const protocol = utils.resolveProtocol(url);

  protocol.get(url, { ...options, ...mergedHeaders }, (res) => {
    miniFetcherResponse = clone(res);

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      miniFetcherResponse.data = JSON.parse(data.toString());
    });
  }).on('close', () => {
    if (miniFetcherResponse.statusCode >= 400) {
      Object.defineProperty(miniFetcherResponse, 'error', {
        value: miniFetcherResponse.data,
        writable: false,
      });
      delete miniFetcherResponse.data;

      return reject(miniFetcherResponse);
    }

    resolve(miniFetcherResponse);
  }).on('error', (err) => {
    reject(err);
  });
});

const buildHandlers = () => {
  const miniFetcher = {};

  for (let method of utils.httpMethods) {
    miniFetcher[method] = (url, options) => request(url, { ...options, method });
    // miniFetcher[method] = function(url, options) {
    //   return request(url, { ...options, method });
    // };
  }

  return miniFetcher;
};

const miniFetcher = buildHandlers();

module.exports = miniFetcher;
