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

    resolve(miniFetcherResponse);
  }).on('error', (err) => {
    reject(err);
  });
});

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

const buildHandlers = () => {
  const miniFetcher = {};

  for (let method of httpMethods) {
    miniFetcher[method] = (url, options) => request(url, { ...options, method });
  }

  return miniFetcher;
};

const miniFetcher = buildHandlers();

module.exports = miniFetcher;

// const get = async (url, options) => request(url, { ...options });
// const post = async (url, options) => request(url, { ...options, method: 'POST' });
// const put = async (url, options) => request(url, { ...options, method: 'PUT' });
// const patch = async (url, options) => request(url, { ...options, method: 'PATCH' });
// const _delete = async (url, options) => request(url, { ...options, method: 'DELETE' });
// const options = async (url, options) => request(url, { ...options, method: 'OPTIONS' });
// const head = async (url, options) => request(url, { ...options, method: 'HEAD' });
// tunnel
// trace

// module.exports = {
//   get,
//   post,
// };
