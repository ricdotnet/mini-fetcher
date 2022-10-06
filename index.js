const http = require('http');
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

  http.get(url, { ...options, ...mergedHeaders }, (res) => {
    miniFetcherResponse = res;

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      miniFetcherResponse.data = data.toString();
    });
  }).on('close', () => {
    if (miniFetcherResponse.statusCode >= 400) {
      return reject(miniFetcherResponse);
    }
    return resolve(miniFetcherResponse);
  }).on('error', (err) => {
    reject(err);
  });
});

const get = async (url, options) => request(url, { ...options });
const post = async (url, options) => request(url, { ...options, method: 'POST' });
const put = async (url, options) => request(url, { ...options, method: 'PUT' });
const patch = async (url, options) => request(url, { ...options, method: 'PATCH' });
const _delete = async (url, options) => request(url, { ...options, method: 'DELETE' });
const options = async (url, options) => request(url, { ...options, method: 'OPTIONS' });
const head = async (url, options) => request(url, { ...options, method: 'HEAD' });
// tunnel
// trace

module.exports = {
  get,
  post,
};
