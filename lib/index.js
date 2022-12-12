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
      ...options.headers, ...userAgent,
      'content-type': 'application/json', // this header needs to auto-added based on the payload
    }
  };

  const protocol = utils.resolveProtocol(url);

  const request = protocol.request(url, { ...options, ...mergedHeaders }, (res) => {
    miniFetcherResponse = clone(res);

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      miniFetcherResponse.data = JSON.parse(data.toString());
      resolve(miniFetcherResponse);
    });
  });

  if (options.body) {
    request.write(Buffer.from(JSON.stringify(options.body)));
  }

  request.end();
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
